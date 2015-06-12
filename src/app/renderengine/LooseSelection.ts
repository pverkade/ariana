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
		return this.line_intersects(line1.point1.x, line1.point1.y, line1.point2.x, line1.point2.y, 
			line2.point1.x, line2.point1.y, line2.point2.x, line2.point2.y);
	}

	getIntersection(line1 : LineElt, line2 : LineElt) : Point{
		var intersectionPoint : Point;

		

		return intersectionPoint;
	}

	// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
	line_intersects(p0_x : number, p0_y : number, p1_x : number, p1_y : number, p2_x : number, p2_y : number, p3_x : number, p3_y : number) {
	 
	    var s1_x, s1_y, s2_x, s2_y;
	    s1_x = p1_x - p0_x;
	    s1_y = p1_y - p0_y;
	    s2_x = p3_x - p2_x;
	    s2_y = p3_y - p2_y;
	 
	    var s, t;
	    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
	    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	 
	    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
	    {
	        // Collision detected
	        return true;
	    }
	 
	    return false; // No collision
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
					// this.points[i].x = intersectionPoint.x;
					// this.points[i].y = intersectionPoint.y;

					return this.points.slice(i, this.points.length);
				}
			}
		}

	return [];
	}
}