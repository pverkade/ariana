class LooseSelection{
	points : Point[][];
	maskBorder : Uint8Array;
	maskWand : Uint8Array;
	maskWandParts : Uint8Array[];

	width : number;
	height : number;

	constructor(width : number, height : number) {
		this.width = width;
		this.height = height;

		this.points = [];
		this.points[0] = [];
		this.maskWandParts = [];
		// this.maskWandParts[0] = new Uint8Array(width * height);

		this.maskBorder = null; // = new Uint8Array(width * height);
		this.maskWand = null; // = new Uint8Array(width * height);
	}

    sign(x : number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

	addPoint(point : Point) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;

		if (this.maskWand[point.y * this.width + point.x] == 0) {
			if (this.points[nrWands - 1].length == 0) {
				this.points[nrWands - 1].push(point);
				this.maskBorder[this.width * point.y + point.x] = 1;
				return true;
			} else 	if (this.points[nrWands - 1][nrPointsLast - 1].x != point.x ||
				this.points[nrWands - 1][nrPointsLast - 1].y != point.y) {

				var difX = point.x - this.points[nrWands - 1][nrPointsLast - 1].x;
				var difY = point.y - this.points[nrWands - 1][nrPointsLast - 1].y;
				var maxDif = Math.max(Math.abs(difX), Math.abs(difY));

                var x = this.points[nrWands - 1][nrPointsLast - 1].x;
                var y = this.points[nrWands - 1][nrPointsLast - 1].y; 

				for (var i = 0; i < maxDif; i++) {
                    x += this.sign(difX);
                    y += this.sign(difY);

                    if (this.maskWand[y * this.width + x] == 0) {
	                    this.points[nrWands - 1].push(new Point(x, y));
	                    this.maskBorder[this.width * y + x] = 1;
                    } else {
                    	this.reset();
                    	return false;
                    }

                    difX -= this.sign(difX);
                    difY -= this.sign(difY);
                }

				return true;
			} 			
		} else if (nrPointsLast > 0){
			// check maskBorder for closed path
		} else {
			this.reset();
		}
		
		return false;
	}

    /* Returns true when points are within 1 pixel distance of each other. */
    comparePoints(point1 : Point, point2 : Point) {
        var difX = point1.x - point2.x;
        var difY = point1.y - point2.y; 

        if (Math.abs(difX) <= 1 && Math.abs(difY) <= 1) {
            return true;
        } else {
            return false;
        }
    }

	curPathContains(x : number, y : number) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length; 

		for (var i = 0; i < nrPointsLast; i++) {
			if (this.points[nrWands - 1][i].x == x && this.points[nrWands - 1][i].y == y) {
				return true;
			}
		}

		return false;
	}

	getInsidePoint() {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if (this.maskBorder[y * this.width + x] == 1 && this.curPathContains(x, y)) {
					if (this.maskBorder[(y + 1) * this.width + x + 1] == 0) {
						return new Point(x+1, y+1);
					} else {
						return new Point(x, y+1);
					}
				}
			}
		}

		return null;
	}

	getLastMaskWand() {
		return this.maskWandParts[this.maskWandParts.length - 1];			
	}

	// getMaskBorder() {
	// 	return this.maskBorder;
	// }

	getLastBoundingPath() {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;
		var curPoint : Point;
		var lastAddedPoint : Point;

        for (var i = this.points[nrWands - 1].length - 5; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            curPoint = this.points[nrWands - 1][i];
            lastAddedPoint = this.points[nrWands - 1][nrPointsLast - 1];
            if (this.comparePoints(curPoint, lastAddedPoint)) {
            	/* Remove points not part of loose selection from maskBoreder and points array. */
                for (var j = 0; j < i; j++) {
                    this.maskBorder[this.points[nrWands - 1][j].y * this.width + this.points[nrWands - 1][j].x] = 0;
                }
                this.points[nrWands - 1].splice(0, i);

				var mask = new MaskSelection(this.maskBorder, this.width, this.height);
				var insidePoint = this.getInsidePoint();

				this.maskWandParts[this.maskWandParts.length] = mask.getMaskWand(insidePoint.x, insidePoint.y);	
				this.mergeMaskWand();

                this.points[nrWands] = [];
                return this.points[nrWands - 1];
            }
        }

		return [];
	}

	getMaskWandPart(index : number) {
		return this.maskWandParts[index];
	}

	getSelectionNr(x : number, y : number) {
		if (this.maskWand[y * this.width + x] == 1) {
			for (var i = 0; i < this.maskWandParts.length; i++) {
				if (this.maskWandParts[i][y * this.width + x] == 1) {
					return i;
				}
			}
		}
		
		return -1;		
	}

	mergeMaskWand() {
		var nrWandParts = this.maskWandParts.length;

		if (nrWandParts > 0) {
			for (var i = 0; i < this.maskWandParts[nrWandParts - 1].length; i++) {
				this.maskWand[i] = this.maskWand[i] || this.maskWandParts[nrWandParts - 1][i];
			}			
		}
	}

	getNrWands() {
		if (this.points.length != this.maskWandParts.length) {
			console.log("this.points.length != this.maskWandParts.length");
			console.log(this.points);
			console.log(this.maskWandParts);
		}
		
		return this.points.length;
	}

	removeSelection(x : number, y : number) {
		var indexSelection = this.getSelectionNr(x, y);

		if (indexSelection != -1) {
			/* Remove from total mask wand. */
			for (var i = 0; i < this.maskWandParts[indexSelection].length; i++) {
				if (this.maskWandParts[indexSelection][i] == 1) {
					this.maskWand[i] = 0;
				}
			}
			/* Remove mask wand part. */
			this.maskWandParts[indexSelection] = null;

			/* Remove from border. */
			for (var i = 0; i < this.points[indexSelection].length; i++) {
				this.maskBorder[this.points[indexSelection][i].y * this.width + this.points[indexSelection][i].x] = 0;
			}

			/* Remove points. */
			this.points[indexSelection] = [];		
		}
		
		return indexSelection;		
	}

	reset() {
		var nrWands = this.points.length;
		var indexPointMask;

		for (var i = 0; i < this.points[nrWands - 1].length; i++) {
			indexPointMask = this.points[nrWands - 1][i].y * this.width + this.points[nrWands - 1][i].x
			this.maskBorder[indexPointMask] = 0;
		} 
		// volgorde van verwijderen punten die wel/niet gebruikt worden en getBoudingPath?
		this.points[nrWands - 1] = [];
	}

	setMaskBorder(maskBorder : Uint8Array) {
        if (this.width * this.height != maskBorder.length) {
            console.log("setMaskBorder: wrong mask sizes");
        } else {
            this.maskBorder = maskBorder;
        }		
	}

    setMaskWand(maskWand : Uint8Array) {
        if (this.width * this.height != maskWand.length) {
            console.log("setMaskWand: wrong mask sizes");
        } else {
            this.maskWand = maskWand;
        }

        this.mergeMaskWand();
    }
}