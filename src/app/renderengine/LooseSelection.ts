class LooseSelection implements SelectionInterface {
	points : Point[];
	maskBorder : number[];

	width : number;
	height : number;

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.maskBorder = [];

		for (var i=0; i < this.width * this.height; i++) {
			this.maskBorder.push(0);
		}
		this.reset();
	}

    sign(x : number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

	addPoint(point : Point) {
		if (this.points.length == 0) {
			this.points.push(point);
			this.maskBorder[this.width * point.y + point.x] = 1;
			return true;
		} else {
			if (this.points[this.points.length-1].x != point.x ||
				this.points[this.points.length-1].y != point.y) {

				var difX = point.x - this.points[this.points.length-1].x;
				var difY = point.y - this.points[this.points.length-1].y;
				var maxDif = Math.max(Math.abs(difX), Math.abs(difY));

                var x = this.points[this.points.length-1].x;
                var y = this.points[this.points.length-1].y; 

				for (var i = 0; i < maxDif; i++) {
                    x += this.sign(difX);
                    y += this.sign(difY);

                    this.points.push(new Point(x, y));
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

	getMaskWand() {
		var borderCount : number;
		var lastEltLine : number;
		var maskWand = [];

		for (var i = 0; i < this.height; i++){
			/* Search for most right border on current line. */
			for (var j = this.width - 1; j >= 0; j--) {
				if (this.maskBorder[i * this.width + j] == 1){
					lastEltLine = j;
					break;
				}
			}

			/* Fill maskWand row. */
			borderCount = 0;
			for (var j = 0; j < this.width; j++) {
				/* Fill maskWand with ones if there is one border crossed. Take into account
					that borders can be horizontal as well. */
				if (j <= lastEltLine) {
					if (this.maskBorder[i * this.width + j] == 1) {
						maskWand.push(1);
						if (j < this.width - 1 && this.maskBorder[i * this.width + j + 1] == 0) {
							borderCount += 1;
						}
					} else if (borderCount % 2 == 1) {
						maskWand.push(1);
					} else {
						maskWand.push(0);
					}
				} else {
					maskWand.push(0);
				}
			}
		}

		return maskWand;
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

	getBoundingPath() {
        for (var i = this.points.length - 4; i >= 0; i--) {
            /* Look if last added point is close enough to current point. */
            if (this.comparePoints(this.points[i], this.points[this.points.length-1])) {
                for (var j = 0; j < i; j++) {
                    this.maskBorder[this.points[j].y * this.width + this.points[j].x] = 0;
                }
                /* Points that are not part of the bounding path are not returned. */
                return this.points.slice(i, this.points.length-1);
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
                imageData.data[(i*this.width+j)*4 + 3] = alpha;
			}
		}
	}

	reset() {
		this.points = [];
	}
}