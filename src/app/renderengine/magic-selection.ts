
class Point {
	x : number;
	y : number;

	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
}

class MagicSelection {
	imageData : Uint8Array;
	magicWandColor : number[];
	bitMaskData : Uint8Array;
	treshold : number;
	width : number;
    height : number;

	constructor() {
	}

	/* Given image data, pixel and treshold value a bitmask for the magic wand is returned. 
	 *	Algorithm checks for lines horizontally and adds line elements above and below to the
	 *	stack when they match the color of the given point.
	 */
	getSelection(imageData : Uint8Array, x : number, y : number, treshold : number, width : number, height: number) : Uint8Array {
		var stack = [];
		var curLine = [];
		var newLine = [];

		this.imageData = imageData;
        this.width = width;
        this.height = height;

		/* Fill bitmask with zeros. */
        this.bitMaskData = new Uint8Array(imageData.length / 4);

		this.magicWandColor = this.getColorPoint(x, y);

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

		return this.bitMaskData;
	}

	/* Return array of points on same line as given point. */
	private searchLine(startX : number, startY : number) {
		var line = [];
		var left : number = startX;
		var right : number = startX;
	
		/* Check if a valid position is given. */
		if (startY < 0 || startY >= this.height || startX < 0 || startX >= this.width ) {
			return null;
		}

		/* Check if point is marked in bitMaskData as part of the selection. */ 
		if (this.bitMaskData[startX + startY * this.width] != 0) {
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
			}	
		}

		/* Search right from starting point. */
		for (var x = startX + 1; x < this.width; x++) {
			if (this.matchPoint(x, startY) == false) {
				right = x;
				break;
			}	
		}

		/* Make line by adding all points that are found and adjust bitmask */
		for (var x = left; x <= right; x++) {
			line.push(new Point(x, startY));
			this.bitMaskData[x + startY * this.width] = 255;
		}

		return line;
	}

	private getColorPoint(x : number, y : number) {
		var Red : number	= this.imageData[(x + y * this.width) * 4];
		var Green : number	= this.imageData[(x + y * this.width) * 4 + 1];
		var Blue  : number	= this.imageData[(x + y * this.width) * 4 + 2];
		var Alpha : number	= this.imageData[(x + y * this.width) * 4 + 3];

		return [Red, Green, Blue, Alpha];
	}

	private matchPoint(x : number, y : number) {
		var curColor = this.getColorPoint(x, y);
		var value = 0.0;

		for (var i = 0; i < 4; i++) {
			value += Math.abs(this.magicWandColor[i] - curColor[i]);
		}

		value /= 4.0 * 255.0; 

		if (value <= this.treshold) {
			return true;
		} else {
			return false;
		}
	}
}