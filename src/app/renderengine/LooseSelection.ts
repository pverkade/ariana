class LineElt {
	point1: Point;
	point2: Point;

	constructor(point1: Point, point2: Point) {
		this.point1 = point1;
		this.point2 = point2;
	}
}

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

	checkIntersection(line1 : LineElt, line2 : LineElt) {

	}

	getIntersection(line1 : LineElt, line2 : LineElt) : Point{
		var intersectionPoint : Point;

		// ..

		return intersectionPoint;
	}

	getkBoundingPath() {
		var intersectionPoint : Point;
		var newLineElt : LineElt;
		var prevLineElt : LineElt;
		var point = this.points[this.points.length - 1];

		if (this.points.length >= 1) {
			newLineElt = new LineElt(this.points[this.points.length -1], point);

			for (var i = this.points.length - 2; i >= 0; i--) {
				prevLineElt = new LineElt(this.points[i], this.points[i+1]);

				if (this.checkIntersection(prevLineElt, newLineElt)) {
					// intersectionPoint = this.getIntersection(prevLineElt, newLineElt);
					this.points[i].x = intersectionPoint.x;
					this.points[i].y = intersectionPoint.y;

					return this.points.slice(i, this.points.length);
				}
			}
		}

	return [];
	}
}