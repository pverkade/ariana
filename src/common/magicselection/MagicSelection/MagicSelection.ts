
class Point {
	x : number;
	y : number;

	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
}

class MagicSelection {
	imageData : ImageData;
	magicWandColor : number[];
	bitmaskData : number[];
	treshold : number;
	bmON : number;
	maskAnts : number[][];

	constructor(imageData : ImageData) {
		this.imageData = imageData;
		this.maskMagicWand = [];
		this.maskPath = [];
		this.maskAnts = [];
		this.magicWandColor = null;
		this.treshold = 0.0;
		this.bmON = 255;

	}

	setTreshold(treshold : number) {
		/* scale treshold value logarithmcally. */
		this.treshold = Math.pow(10, 1 - (100 / treshold));
	}

	/* Given image data, pixel and treshold value (1-100) a bitmask for the magic wand is returned. 
		Algorithm checks for lines horizontally and adds line elements above and below to the 
		stack when they match the color of the given point. */
	getSelection(x : number, y : number) {
		var stack = [];
		var curLine = [];
		var newLine = [];

		this.magicWandColor = this.getColorPoint(x, y);

		/* Fill maskMagicWand with zeros. */
		if (maskMagicWand != []) {
			for (var i = 0; i < imageData.data.length / 4; i++) {
				this.maskMagicWand.push(0);
			}
		}

		/* Use searchLine to get a horizontal line of points with colors next to given point
			and push to stack. */
		curLine = this.searchLine(x, y);
		stack.push(curLine);

		/* Keep popping line elements from stack until stack is empty. Push first all line elements
			above current line and then push all line elements below current line.  */
		while (stack.length > 0 && curLine != null) {
			curLine = stack.pop();

			for (var i = 0; i < curLine.length; i++) {
				/* Check if there is a line element above current position. */
				newLine = this.searchLine(curLine[i].x, curLine[i].y - 1);
				if (newLine != null) {
					stack.push(newLine);
				}			
			}

			for (var i = 0; i < curLine.length; i++) {
				/* Check if there is a line element below current position. */
				newLine = this.searchLine(curLine[i].x, curLine[i].y + 1);
				if (newLine != null) {
					stack.push(newLine);
				}	
			}
		}

		this.getBoundingPath();
		
		return this.maskPath;
	}

	/* Return array of points on same line as given point. */
	searchLine(startX : number, startY : number) {
		var line = [];
		var left = startX;
		var right = startX;
	
		/* Check if a valid position is given. */
		if (startY < 0 || startY >= this.imageData.height || startX < 0 || startX >= this.imageData.width ) {
			return null;
		}

		/* Check if point is marked in bitmaskData as part of the selection. */ 
		if (this.bitmaskData[startX + startY * this.imageData.width] != 0) {
			return null;
		}

		/* Check if point matches magicWandColor. */
		if (this.matchPoint(startX, startY) == false) {
			return null;
		}

		/* Search left from starting point. */
		for (var x = startX - 1; x >= 0; x--) {
			if (this.matchPoint(x, startY) == false) {
				left = x;
				break;
			} else if( x == 0) {
				left = 0;
				break;
			}
		}

		/* Search right from starting point. */
		for (var x = startX + 1; x < this.imageData.width; x++) {
			if (this.matchPoint(x, startY) == false) {
				right = x;
				break;
			} else if( x == this.imageData.width - 1) {
				right = this.imageData.width - 1;
				break;
			}
		}
		
		/* Make line by adding all points that are found and adjust bitmask */
		for (var x = left; x <= right; x++) {
			line.push(new Point(x, startY));
			this.bitmaskData[x + startY * this.imageData.width] = this.bmON;
		}

		return line;
	}

	getBoundingPath() {
		// var newBMData = [];

		if (this.maskPath == []) {
			/* Fill new bitmask with zeros. */
			for (var i = 0; i < this.bitmaskData.length; i++) {
				this.maskPath.push(0);
			}
		}
		
		/* Iterate over bitmaskData and possible adjust bits that are set. */
		for (var i = 0; i < this.bitmaskData.length; i++) {
			if (this.bitmaskData[i] == this.bmON) {
				/* Check for borders of image (pixel on border of image is edge). */
				if (i % this.imageData.width == 0 ||
				  i % this.imageData.width == this.imageData.width - 1 ||
				  Math.floor( i / this.imageData.width) == 0 || 
				  Math.floor( i / this.imageData.width) >= this.imageData.height - 1) { /// aanpassing <--
					this.maskPath[i] = this.bmON;
				/* Check if one 8 neighbor pixels is off then it is an "inside" pixel. */
				} else if ( this.bitmaskData[i - this.imageData.width - 1] == 0 ||
						this.bitmaskData[i - this.imageData.width ] == 0 ||
						this.bitmaskData[i - this.imageData.width + 1] == 0 ||
						this.bitmaskData[i - 1] == 0 ||
						this.bitmaskData[i + 1] == 0 ||
						this.bitmaskData[i + this.imageData.width - 1] == 0 ||
						this.bitmaskData[i + this.imageData.width] == 0 ||
						this.bitmaskData[i + this.imageData.width + 1] == 0 ) {
					this.maskPath[i] = this.bmON;
				}
			}
		}

		/* Copy adjusted bitmask back bitmaskData class field. */
		for (var i = 0; i < this.bitmaskData.length; i++) {
			this.maskPath[i] = newBMData[i];
		}
	}

	applyFilter(size : number, offset : number) {

		if (this.maskAnts[offset] == undefined) {
			/* A square of maximum size width/height of image data has to be created. */
			var max_size = Math.max(this.imageData.width, this.imageData.height);

			this.maskAnts[offset] = [];

			for (var i = 0; i < this.imageData.height; i++) {
				for (var j = 0; j < this.imageData.width; j++) {
					if (this.bitmaskData[i*this.imageData.width + j] == 0) {
						this.maskAnts[offset][i*this.imageData.width + j] = 0;
					} else if ((i + j + offset) % size < size / 2) {
						this.maskAnts[offset][i*this.imageData.width + j] = 1;
					} else {
						this.maskAnts[offset][i*this.imageData.width + j] = 0;
					}
				}
			}
		} 
	}

	marchingAnts(offset : number) {
		this.applyFilter(8, offset);

		return this.maskAnts[offset];
	}

	getColorPoint(x : number, y : number) {
		var Red		= this.imageData.data[(x + y * this.imageData.width) * 4];
		var Green	= this.imageData.data[(x + y * this.imageData.width) * 4 + 1];
		var Blue	= this.imageData.data[(x + y * this.imageData.width) * 4 + 2];
		// var Alpha	= this.imageData.data[(x + y * this.imageData.width) * 4 + 3];

		return [Red, Green, Blue];
	}

	matchPoint(x : number, y : number) {
		var curColor = this.getColorPoint(x, y);
		var value = 0.0;

		for (var i = 0; i < 3; i++) {
			value += Math.pow(this.magicWandColor[i] - curColor[i], 2);
		}

		value /= 3.0 * 255.0 * 255.0; 

		if (value <= this.treshold) {
			return true;
		} else {
			return false;
		}
	}
}