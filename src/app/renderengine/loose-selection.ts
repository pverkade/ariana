class LooseSelection extends AbstractSelection {
	points : Point[][];

	constructor(width : number, height : number) {
		super(width, height);

		this.points = [];
		this.points[0] = [];
	}

	addPoint(point : Point) {
		var nrPoints = this.points.length;
		var nrPointsLast = this.points[nrPoints - 1].length;

		if (this.maskWand[point.y * this.width + point.x] == 0) {
			if (nrPointsLast == 0) {
				this.points[nrPoints - 1].push(point);
				return true;
			} else 	if (this.points[nrPoints - 1][nrPointsLast - 1].x != point.x ||
						this.points[nrPoints - 1][nrPointsLast - 1].y != point.y) {
				var difX = point.x - this.points[nrPoints - 1][nrPointsLast - 1].x;
				var difY = point.y - this.points[nrPoints - 1][nrPointsLast - 1].y;
				var maxDif = Math.max(Math.abs(difX), Math.abs(difY));

                var x = this.points[nrPoints - 1][nrPointsLast - 1].x;
                var y = this.points[nrPoints - 1][nrPointsLast - 1].y; 

				for (var i = 0; i < maxDif; i++) {
                    x += super.sign(difX);
                    y += super.sign(difY);

                    if (this.maskWand[y * this.width + x] == 0) {
	                    this.points[nrPoints - 1].push(new Point(x, y));
                    } else {
                    	this.reset();
                    	return false;
                    }

                    difX -= super.sign(difX);
                    difY -= super.sign(difY);
                }

				return true;
			} 			
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

	determineOrientation() {
		var nrPoints = this.points.length;
		var area = 0;

	    for (var i = 0; i < this.points[nrPoints - 1].length; i++) {
	        var j = (i + 1) % this.points[nrPoints - 1].length;
	        area += this.points[nrPoints - 1][i].x * this.points[nrPoints - 1][j].y;
	        area -= this.points[nrPoints - 1][j].x * this.points[nrPoints - 1][i].y;
	    }

	    /* Return false for clockwise. */
	    if (area > 0) {
	    	return false;
	    } else {
	    	return true;
	    }
	}

	neighborBorder(point : Point, size : number) {
		var distance = size + 1;
		var closestPoint = null;

		for (var i = -size; i <= size; i++) {
			for(var j = -size; j <= size; j++) {
				if (Math.max(i, j) < distance && (i != 0 || j != 0)) {
					if (this.maskBorder[(point.y + i) * this.width + point.x + j] == 1) {
						closestPoint = new Point(j, i);
					}				
				}

			}
		}

		return closestPoint;
	}	

    fixHole(loosePoint : Point, deltaPoint : Point) {
    	var dX = deltaPoint.x;
    	var dY = deltaPoint.y;
    	var curPoint = new Point(loosePoint.x, loosePoint.y);

    	while (dX != 0 && dY != 0) {
    		curPoint.x += super.sign(dX);
    		curPoint.y += super.sign(dY);

    		this.maskBorder[curPoint.y * this.width + curPoint.x] = 1;

    		dX -= super.sign(dX);
    		dY -= super.sign(dY);
    	}
    }

    getInsidePoint() {
    	var nrPoints = this.points.length;
		var nrPointsLast = this.points[nrPoints - 1].length;
    	var sumX : number = 0;
    	var sumY : number = 0;

    	for (var i = 0; i < nrPointsLast; i++) {
    		sumX += this.points[nrPoints - 1][i].x;
    		sumY += this.points[nrPoints - 1][i].y;
    	}

    	var x = Math.round(sumX / nrPointsLast);
    	var y = Math.round(sumY / nrPointsLast);
    	return new Point(x, y);
    }

    newAdjustedArea() {
    	var nrPoints = this.points.length;
		var nrPointsLast = this.points[nrPoints - 1].length;
		var skipSize = 4;

		var deltaFirstPoint = this.neighborBorder(this.points[nrPoints - 1][0], skipSize);
		var deltaLastPoint = this.neighborBorder(this.points[nrPoints - 1][nrPointsLast - 1], skipSize); 

		if (nrPointsLast > 10 && deltaFirstPoint != null && deltaLastPoint != null) { 

			for (var i = 0; i < nrPointsLast; i++) {
				var indexPointMask = this.points[nrPoints - 1][i].y * this.width + this.points[nrPoints - 1][i].x;
				this.maskBorder[indexPointMask] = 1;
			}

			this.fixHole(this.points[nrPoints - 1][0], deltaFirstPoint);
			this.fixHole(this.points[nrPoints - 1][nrPointsLast - 1], deltaLastPoint);

			var mask = new MaskSelection(this.maskBorder, this.width, this.height);
			var insidePoint = this.getInsidePoint();

			this.maskWandParts[this.maskWandParts.length] = mask.getMaskWand(insidePoint.x, insidePoint.y);

			/* Given border is part of the mask wand. */
			for (var i = 0; i < nrPointsLast; i++) {
				var indexPointMask = this.points[nrPoints - 1][i].y * this.width + this.points[nrPoints - 1][i].x;
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

            this.points[nrPoints] = [];
            return this.points[nrPoints - 1];
		}

		return [];   	
    }

	getLastBoundingPath() {
		var nrPoints = this.points.length;
		var nrPointsLast = this.points[nrPoints - 1].length;
		var curPoint : Point;
		var lastAddedPoint : Point;
		var insidePoint : Point;

		// var newArea = this.newAdjustedArea();

		// if (newArea.length > 0) {
		//  	return newArea;
		// }

        for (var i = nrPointsLast - 10; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            curPoint = this.points[nrPoints - 1][i];
            lastAddedPoint = this.points[nrPoints - 1][nrPointsLast - 1];
            if (this.comparePoints(curPoint, lastAddedPoint)) {
                this.points[nrPoints - 1].splice(0, i);

                for (var j = 0; j < this.points[nrPoints - 1].length; j++) {
                	this.maskBorder[this.points[nrPoints - 1][j].y * this.width + this.points[nrPoints - 1][j].x] = 1;
                }

				var mask = new MaskSelection(this.maskBorder, this.width, this.height);
				insidePoint = this.getInsidePoint();
				this.maskWandParts[this.maskWandParts.length] = mask.getMaskWand(insidePoint.x, insidePoint.y);

				/* Points added by user are part of the mask wand! */
				for (var j = 0; j < this.points[nrPoints - 1].length; j++) {
					var indexPointMask = this.points[nrPoints - 1][j].y * this.width + this.points[nrPoints - 1][j].x;
					this.maskWandParts[this.maskWandParts.length - 1][indexPointMask] = 1;
				}	
				this.mergeMaskWand();
				this.getMaskBorder();

                this.points[nrPoints] = [];
                return this.points[nrPoints - 1];
            }
        }

		return [];
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
		var nrPoints = this.points.length;

		if (super.clearLast() == false) {
			return false;
		}

		this.points.splice(nrPoints - 2, 1);
		return true;
	}
}