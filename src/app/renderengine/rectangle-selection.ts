class Rectangle{
	point1 : Point;
	point2 : Point;

	constructor(point1 : Point, point2 : Point) {
		this.point1 = new Point(point1.x, point1.y);
		this.point2 = new Point(point2.x, point2.y);
	}
}


class RectangleSelection extends AbstractSelection {
	rects: Rectangle[];

	constructor(width : number, height : number) {
		super(width, height);
		this.rects = [];
	}

	addRect(point1 : Point, point2 : Point) {
		var topLeft = new Point(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
		var bottomRight = new Point(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));

		var width =  bottomRight.x - topLeft.x;
		var height = bottomRight.y - topLeft.y;
		var indexPointMask : number;

		this.rects.push(new Rectangle(point1, point2));

		/* Create and draw mask wand. */
		this.maskWandParts.push(new Uint8Array(this.width * this.height));
		var nrWands = this.maskWandParts.length;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var indexPointMask = (topLeft.y + y) * this.width + topLeft.x + x;
				if (this.maskWand[indexPointMask] == 0) {
					this.maskWandParts[nrWands - 1][indexPointMask] = 1;
				}
			}
		}

		/* Merge new mask wand and get borders. */
		this.mergeMaskWand();
		this.getMaskBorder();

		return this.maskWandParts[this.maskWandParts.length - 1];
	}

	validRect(point1 : Point, point2 : Point) {
		var topLeft = new Point(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
		var bottomRight = new Point(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));

		var width = bottomRight.x - topLeft.x;
		var height = bottomRight.y - topLeft.y;
		var indexPointMask : number;

		/* Check whether there is an intersection with previous selections. */
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var indexPointMask = (topLeft.y + y) * this.width + topLeft.x + x;
				if (this.maskWand[indexPointMask] == 1) {
					return false;
				}
			}
		}

		return true;
	}
}