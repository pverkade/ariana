class Rectangle{
	point1 : Point;
	point2 : Point;

	constructor(point1 : Point, point2 : Point) {
		this.point1 = new Point(point1.x, point1.y);
		this.point2 = new Point(point2.x, point2.y);
	}
}


class RectangleSelection extends AbstractSelection implements SelectionInterface {
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

		/* Draw borders in mask. */
		for (var y = 0; y < height; y++) {
			indexPointMask = (topLeft.y + y) * this.width + topLeft.x;
			this.maskBorder[indexPointMask] = 1;
			indexPointMask = (topLeft.y + y) * this.width + bottomRight.x;
			this.maskBorder[indexPointMask] = 1;
		}

		for (var x = 0; x < width; x++) {
			indexPointMask = topLeft.y * this.width + topLeft.x + x;
			this.maskBorder[indexPointMask] = 1;
			indexPointMask = bottomRight.y * this.width + topLeft.x + x;
			this.maskBorder[indexPointMask] = 1;
		}

		this.maskWandParts[this.maskWandParts.length] = new Uint8Array(this.width * this.height);

		/* Draw mask wand. */
		var nrWands = this.maskWandParts.length;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var indexPointMask = (topLeft.y + y) * this.width + topLeft.x + x;
				this.maskWandParts[nrWands - 1][indexPointMask] = 1;
			}
		}

		this.mergeMaskWand();

		return this.maskWandParts[this.maskWandParts.length - 1];
	}

	clearLast() : boolean {
		var nrWands = this.maskWandParts.length;
		var point1 = this.rects[this.rects.length - 1].point1;
		var point2 = this.rects[this.rects.length - 1].point2;

		var topLeft = new Point(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
		var bottomRight = new Point(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));

		var width =  bottomRight.x - topLeft.x;
		var height = bottomRight.y - topLeft.y;
		var indexPointMask;

		if (nrWands < 1) {
			return false;
		}

		for (var y = 0; y < height; y++) {
			indexPointMask = (topLeft.y + y) * this.width + topLeft.x;
			this.maskBorder[indexPointMask] = 0;
			indexPointMask = (topLeft.y + y) * this.width + bottomRight.x;
			this.maskBorder[indexPointMask] = 0;
		}

		for (var x = 0; x < width; x++) {
			indexPointMask = topLeft.y * this.width + topLeft.x + x;
			this.maskBorder[indexPointMask] = 0;
			indexPointMask = bottomRight.y * this.width + topLeft.x + x;
			this.maskBorder[indexPointMask] = 0;
		}

		for (var i = 0; i < this.maskWandParts[nrWands - 1].length; i++) {
			if (this.maskWandParts[nrWands - 1][i] == 1) {
				this.maskWand[i] = 0;
				this.maskWandParts[nrWands - 1][i] = 0;
			}
		}

		this.maskWandParts.splice(nrWands - 1, 1);

		return true;
	}



	removeRect() {

	}


}