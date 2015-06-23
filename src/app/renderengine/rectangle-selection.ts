

class Rectangle implements SelectionInterface {
	points : Point[][];
	maskBorder : Uint8Array;
	maskWand : Uint8Array;
	maskWandParts : Uint8Array[];

	width : number;
	height : number;

	constructor(width : number, height : number) {
		this.width = width;
		this.height = height;

		this.points = [];
		this.points[0] = [];
		this.maskWandParts = [];

		this.maskBorder = null; 
		this.maskWand = null;
	}
}