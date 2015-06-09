
class Ellipse {
	center : Point;
	radius_hor : number;
	radius_ver : number;
}

class Rect {
	point1 : Point;
	point2 : Point;
}

class Selection2 {
	rect : Rect;
	ellipse : Ellipse;

	imageData : ImageData;
	bitMaskData : number[];

	setSelection(rect : Rect) {
		if (rect != this.rect) {

		}

		switch("rect") {
			case "rect":
		}
	}


	returnCopy() {

	}
}