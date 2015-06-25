/*
 * Project ariana
 * File: loose-selections.ts
 * Author: Merwin van Dijk
 * Date: June 25th, 2015
 * Description: this file contains the LooseSelection class. The class allows
 * points to be added and provides a method to check whether a bounding path is
 * created. If this is the case the maskBorder, maskWand and maskWandParts 
 * bitmasks are adjusted.
 */

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

	                this.points[nrPoints - 1].push(new Point(x, y));

                    difX -= super.sign(difX);
                    difY -= super.sign(difY);
                }

				return true;
			} 			
		} 
		
		return false;
	}

	clearLast() {
		var nrPoints = this.points.length;

		if (super.clearLast() == false) {
			return false;
		}

		this.points.splice(nrPoints - 2, 1);
		return true;
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

    /* Get inside point by calculating mass punt of wand. */
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

    /* Get inside point bij calculating orientation (clockwise or counter clockwise) and
    	choosing a random point and its successor and turn left or right according to orrientation. */
    getInsidePoint2() {
    	var magicNr = 10;
    	var curPoints = this.points[this.points.length-1];
    	var startPoint = curPoints[curPoints.length - magicNr];		
		var ccw = this.determineOrientation();
		var dXAdj : number;
		var dYAdj : number;
 
		var deltaPoint = new Point(curPoints[curPoints.length - magicNr + 1].x - startPoint.x,
								curPoints[curPoints.length - magicNr + 1].y - startPoint.y);

		var signX = this.sign(deltaPoint.x);
		var signY = this.sign(deltaPoint.y);


		/* Points drawn in counter clockwise direction. */
		if (ccw == true) {
			dXAdj = super.sign(signX + signY); 
			dYAdj = super.sign(signY - signX);
		/* Points drawn in clockwise direction. */
		} else {
			dXAdj = super.sign(signX - signY); 
			dYAdj = super.sign(signX + signY); 
		}

		if (this.maskBorder[(startPoint.y + dYAdj) * this.width + startPoint.x + dXAdj] == 0) {
			return new Point(startPoint.x + dXAdj, startPoint.y + dYAdj);
		} else {
			console.log("hopelijk gaat dit goed");
			return new Point(startPoint.x + 2 * dXAdj, startPoint.y + 2 * dYAdj);
		}
    }

	getLastBoundingPath() {
		var nrPoints = this.points.length;
		var nrPointsLast = this.points[nrPoints - 1].length;
		var curPoint : Point;
		var lastAddedPoint : Point;
		var insidePoint : Point;

        for (var i = nrPointsLast - 10; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            curPoint = this.points[nrPoints - 1][i];
            lastAddedPoint = this.points[nrPoints - 1][nrPointsLast - 1];
            if (this.comparePoints(curPoint, lastAddedPoint)) {
                this.points[nrPoints - 1].splice(0, i);

                var maskBorder = new Uint8Array(this.maskWand.length);
                for (var j = 0; j < this.points[nrPoints - 1].length; j++) {
                	maskBorder[this.points[nrPoints - 1][j].y * this.width + this.points[nrPoints - 1][j].x] = 1;
                }

				var mask = new MaskSelection(maskBorder, this.width, this.height);
				insidePoint = this.getInsidePoint2();
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

    /* Used when current attemt to create loose selection stopped. */
	reset() {
		var nrPoints = this.points.length;
		var indexPointMask;

		for (var i = 0; i < this.points[nrPoints - 1].length; i++) {
		 	indexPointMask = this.points[nrPoints - 1][i].y * this.width + this.points[nrPoints - 1][i].x;
		 	this.maskBorder[indexPointMask] = 0;
		} 
		
		this.points[nrPoints - 1] = [];
	}
}