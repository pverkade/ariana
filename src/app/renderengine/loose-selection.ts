class LooseSelection implements SelectionInterface{
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

		this.maskBorder = null; 
		this.maskWand = null;
	}

    sign(x : number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

	addPoint(point : Point) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;

		if (this.maskWand[point.y * this.width + point.x] == 0) {
			if (this.points[nrWands - 1].length == 0) {	// if statements can be simplified?
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
		} else {
			// this.reset();
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

	determineOrientation() {
		var nrWands = this.points.length;
		var area = 0;

	    for (var i = 0; i < this.points[nrWands - 1].length; i++) {
	        var j = (i + 1) % this.points[nrWands - 1].length;
	        area += this.points[nrWands - 1][i].x * this.points[nrWands - 1][j].y;
	        area -= this.points[nrWands - 1][j].x * this.points[nrWands - 1][i].y;
	    }

	    /* Return false for clockwise. */
	    if (area > 0) {
	    	return false;
	    } else {
	    	return true;
	    }
	}

	/* Returns index of neighbor maskWandPart if exist within pixels distance of point. */
	neighborMaskWand(point : Point, size : number) {
		var distance = size + 1;
		var closestPoint = null;

		for (var i = -size; i <= size; i++) {
			for(var j = -size; j <= size; j++) {
				if (Math.max(i, j) < distance && i != 0 && j!= 0) {
					if (this.maskWand[(point.y + i) * this.width + point.x + j] == 1) {
						closestPoint = new Point(j, i);
					}				
				}

			}
		}

		return closestPoint;
	}	

    getMaskBorder() {        
        for (var i = 0; i < this.maskWand.length; i++) {
            if (this.maskWand[i] == 1) {
                /* Check for borders of image (pixel on border of image is edge). */
                if (i % this.width == 0 ||
                  Math.floor( i / this.width) == 0 || 
                  Math.floor( i / this.width) >= this.height - 1) { /// aanpassing <--
                    this.maskBorder[i] = 1;
                /* Check if one 8 neighbor pixels is off then it is an "inside" pixel. */
                } else if ( this.maskWand[i - this.width - 1] == 0 ||
                    this.maskWand[i - this.width ] == 0 ||
                    this.maskWand[i - this.width + 1] == 0 ||
                    this.maskWand[i - 1] == 0 ||
                    this.maskWand[i + 1] == 0 ||
                    this.maskWand[i + this.width - 1] == 0 ||
                    this.maskWand[i + this.width] == 0 ||
                    this.maskWand[i + this.width + 1] == 0 ) {
                    this.maskBorder[i] = 1;
                } else {
                    this.maskBorder[i] = 0;
                }
            }
        }

        return this.maskBorder;
    }

    fixHole(loosePoint : Point, deltaPoint : Point) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;
    	var dX = deltaPoint.x;
    	var dY = deltaPoint.y;
    	var curPoint = new Point(loosePoint.x, loosePoint.y);

    	while (dX != 0 && dY != 0) {
    		curPoint.x += this.sign(dX);
    		curPoint.y += this.sign(dY);

    		this.maskBorder[curPoint.y * this.width + curPoint.x] = 1;

    		dX -= this.sign(dX);
    		dY -= this.sign(dY);

    		if (Math.abs(dX) > 20) {
    			console.log("error in fixHole");
    			console.log(dX, dY);
    		}
    	}
    }

	getLastBoundingPath() {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;
		var curPoint : Point;
		var lastAddedPoint : Point;
		var insidePoint : Point;
		var skipSize = 4;

		var deltaFirstPoint = this.neighborMaskWand(this.points[nrWands - 1][0], skipSize);
		var deltaLastPoint = this.neighborMaskWand(this.points[nrWands - 1][nrPointsLast - 1], skipSize);
		// console.log(deltaFirstPoint, deltaLastPoint);

		if (nrPointsLast > 10 && deltaFirstPoint != null && deltaLastPoint != null) { 
			var ccw = this.determineOrientation();
			// var dX = this.points[nrWands - 1][1].x - this.points[nrWands - 1][0].x
			// var dY = this.points[nrWands - 1][1].y - this.points[nrWands - 1][0].y
			var dXAdj : number;
			var dYAdj : number;

			for (var i = 0; i < this.points[nrWands - 1].length; i++) {
				var indexPointMask = this.points[nrWands - 1][i].y * this.width + this.points[nrWands - 1][i].x;
				this.maskBorder[indexPointMask] = 1;
			}

			this.fixHole(this.points[nrWands - 1][0], deltaFirstPoint);
			this.fixHole(this.points[nrWands - 1][nrPointsLast - 1], deltaLastPoint);

			var signX = this.sign(deltaLastPoint.x);
			var signY = this.sign(deltaLastPoint.y);

			/* Points drawn in counter clockwise direction. */
			if (ccw == true) {
				dXAdj = this.sign(signX + signY); // 2 * (deltaLastpoint.x + deltaLastpoint.y); // dX + dY;
				dYAdj = this.sign(signY - signX);// 2 * (-deltaLastpoint.x + deltaLastpoint.y);// -dX + dY;
			/* Points drawn in clockwise direction. */
			} else {
				dXAdj = this.sign(signX - signY); // (this.sign(deltaLastpoint.y) - deltaLastpoint.x); // -dY + dX;
				dYAdj = this.sign(signX + signY); // (deltaLastpoint.x + deltaLastpoint.y); // dX + dY;
				console.log("clockwise");
			}

			var mask = new MaskSelection(this.maskBorder, this.width, this.height);
			insidePoint = new Point(this.points[nrWands - 1][nrPointsLast - 1].x + 2 * dXAdj, this.points[nrWands - 1][nrPointsLast - 1].y + 2 * dYAdj);
			// console.log(insidePoint.x, insidePoint.y)
			this.maskWandParts[this.maskWandParts.length] = mask.getMaskWand(insidePoint.x, insidePoint.y);

			/* Given border is part of the mask wand. */
			for (var i = 0; i < this.points[nrWands - 1].length; i++) {
				var indexPointMask = this.points[nrWands - 1][i].y * this.width + this.points[nrWands - 1][i].x;
				this.maskWandParts[this.maskWandParts.length - 1][indexPointMask] = 1;
			}

			/* Mask wand part should only contain the area of one part. Remove possible 
				borders from maskBorder in mask. */ 
			for (var i = 0; i < this.maskWand.length; i++) {
				if (this.maskWand[i]) {
					this.maskWandParts[this.maskWandParts.length - 1][i] = 0;
			 	}
			} 

			/* Both needed to get correct maskWand and maskBorder. */
			this.mergeMaskWand();
			this.getMaskBorder();

            this.points[nrWands] = [];
            return this.points[nrWands - 1];
		}

        for (var i = this.points[nrWands - 1].length - 20; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            curPoint = this.points[nrWands - 1][i];
            lastAddedPoint = this.points[nrWands - 1][nrPointsLast - 1];
            if (this.comparePoints(curPoint, lastAddedPoint)) {
            	/* Remove points not part of loose selection from maskBorder and points array. */
                for (var j = 0; j < i; j++) {
                    this.maskBorder[this.points[nrWands - 1][j].y * this.width + this.points[nrWands - 1][j].x] = 0;
                }
                this.points[nrWands - 1].splice(0, i);

				var mask = new MaskSelection(this.maskBorder, this.width, this.height);
				insidePoint = this.getInsidePoint();

				this.maskWandParts[this.maskWandParts.length] = mask.getMaskWand(insidePoint.x, insidePoint.y);

				for (var j = 0; j < this.points[nrWands - 1].length; j++) {
					var indexPointMask = this.points[nrWands - 1][j].y * this.width + this.points[nrWands - 1][j].x;
					this.maskWandParts[this.maskWandParts.length - 1][indexPointMask] = 1;
				}	

				this.mergeMaskWand();
				// this.getMaskBorder();

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

		// this.maskWand = new Uint8Array(this.width * this.height);

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
		var nrPoints = this.points.length;
		var indexPointMask;

		for (var i = 0; i < this.points[nrPoints - 1].length; i++) {
			indexPointMask = this.points[nrPoints - 1][i].y * this.width + this.points[nrPoints - 1][i].x;
			this.maskBorder[indexPointMask] = 0;
		} 
		
		this.points[nrPoints - 1] = [];
	}

	clearLast() {
		var nrWands = this.maskWandParts.length;
		var nrPoints = this.points.length;
		var indexPointMask;

		if (nrWands < 1) {
			return false;
		}

		for (var i = 0; i < this.points[nrPoints - 2].length; i++) {
			indexPointMask = this.points[nrPoints - 2][i].y * this.width + this.points[nrPoints - 2][i].x;
			this.maskBorder[indexPointMask] = 0;
		} 

		for (var i = 0; i < this.maskWandParts[nrWands - 1].length; i++) {
			if (this.maskWandParts[nrWands - 1][i] == 1) {
				this.maskWand[i] = 0;
			}
		}
		this.maskWandParts[nrWands - 1] = new Uint8Array(0);
		// this.mergeMaskWand();
		
		this.points[nrPoints - 2] = [];
		return true;
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