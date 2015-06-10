class LooseSelection {
	points : Point[];

	constructor() {
		this.points = [];
	}

	addPoint(point : Point) {
		if (this.points[this.points.length-1].x != point.x &&
			this.points[this.points.length-1].y != point.y) {
			this.points.push(point);
		}
	}
}