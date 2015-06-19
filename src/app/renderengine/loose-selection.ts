class LooseSelection implements SelectionInterface {
	points : Point[][];
	maskBorder : number[];

	width : number;
	height : number;

	constructor(width : number, height : number) {
		this.width = width;
		this.height = height;

		this.points = [];
		this.points[0] = [];

		this.maskBorder = [];
		for (var i = 0; i < this.width * this.height; i++) {
			this.maskBorder.push(0);
		}
	}

    sign(x : number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

	addPoint(point : Point) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;

		if (this.points[nrWands - 1].length == 0) {
			this.points[nrWands - 1].push(point);
			this.maskBorder[this.width * point.y + point.x] = 1;
			return true;
		} else {
			if (this.points[nrWands - 1][nrPointsLast - 1].x != point.x ||
				this.points[nrWands - 1][nrPointsLast - 1].y != point.y) {

				var difX = point.x - this.points[nrWands - 1][nrPointsLast - 1].x;
				var difY = point.y - this.points[nrWands - 1][nrPointsLast - 1].y;
				var maxDif = Math.max(Math.abs(difX), Math.abs(difY));

                var x = this.points[nrWands - 1][nrPointsLast - 1].x;
                var y = this.points[nrWands - 1][nrPointsLast - 1].y; 

				for (var i = 0; i < maxDif; i++) {
                    x += this.sign(difX);
                    y += this.sign(difY);

                    this.points[nrWands - 1].push(new Point(x, y));
                    this.maskBorder[this.width * y + x] = 1;

                    difX -= this.sign(difX);
                    difY -= this.sign(difY);
                }

				return true;
			} else {
				return false;
			}
		}
	}

	/* -2 since a new empty path is added. */
	LastPathContains(x : number, y : number) {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 2].length; 

		for (var i = 0; i < nrPointsLast; i++) {
			if (this.points[nrWands - 2][i].x == x && this.points[nrWands - 2][i].y == y) {
				return true;
			}
		}

		return false;
	}

	getInsidePoint() {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if (this.maskBorder[y * this.width + x] == 1 && this.LastPathContains(x, y)) {
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

	getMaskWand() {
		var mask = new MaskSelection(this.maskBorder, this.width, this.height);
		var insidePoint = this.getInsidePoint();

		return mask.getMaskWand(insidePoint.x, insidePoint.y);				
	}

	getMaskBorder() {
		return this.maskBorder;
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

    // getLastBoundingPath()?
	getLastBoundingPath() {
		var nrWands = this.points.length;
		var nrPointsLast = this.points[nrWands - 1].length;
		var curPoint : Point;
		var lastAddedPoint : Point;

        for (var i = this.points[nrWands - 1].length - 4; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            curPoint = this.points[nrWands - 1][i];
            lastAddedPoint = this.points[nrWands - 1][nrPointsLast - 1];
            if (this.comparePoints(curPoint, lastAddedPoint)) {
            	/* Remove points not part of loose selection from maskBoreder and points array. */
                for (var j = 0; j < i; j++) {
                    this.maskBorder[this.points[nrWands - 1][j].y * this.width + this.points[nrWands - 1][j].x] = 0;
                }
                this.points[nrWands - 1].splice(0, i);

                this.points[nrWands] = [];
                return this.points[nrWands - 1];
            }
        }

		return [];
	}

	marchingAnts(imageData : ImageData, size : number, offset : number) : void {
        var alpha;

		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				if (this.maskBorder[i*this.width + j] == 0) {
                    alpha = 0;
				} else if ((i + j + offset) % size < size / 2) {
                    alpha = 255;
				} else {
                    alpha = 0;
				}
                imageData.data[(i * this.width + j) * 4 + 3] = alpha;
			}
		}
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
}