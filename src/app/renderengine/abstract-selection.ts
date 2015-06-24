class AbstractSelection {
	maskBorder : Uint8Array;
	maskWand : Uint8Array;
	maskWandParts : Uint8Array[];

	width : number;
	height : number;

	constructor(width : number, height : number) {
		this.width = width;
		this.height = height;

		this.maskWandParts = [];
		this.maskBorder = null; 
		this.maskWand = null;
	}

    getNrWands() {
    	return this.maskWandParts.length;
    }

	getLastMaskWand() {
		return this.maskWandParts[this.maskWandParts.length - 1];			
	}

    getMaskBorder() {        
        for (var i = 0; i < this.maskWand.length; i++) {
            if (this.maskWand[i] == 1) {
                /* Check for borders of image (pixel on border of image is edge). */
                if (i % this.width == 0 ||
                  Math.floor( i / this.width) == 0 || 
                  Math.floor( i / this.width) >= this.height - 1) { /// aanpassing <--
                    this.maskBorder[i] = 1;
                /* Check if one 8 neighbor pixels is off then it is an "inside" pixel. */
                } else if ( this.maskWand[i - this.width - 1] == 0 ||
                    this.maskWand[i - this.width ] == 0 ||
                    this.maskWand[i - this.width + 1] == 0 ||
                    this.maskWand[i - 1] == 0 ||
                    this.maskWand[i + 1] == 0 ||
                    this.maskWand[i + this.width - 1] == 0 ||
                    this.maskWand[i + this.width] == 0 ||
                    this.maskWand[i + this.width + 1] == 0 ) {
                    this.maskBorder[i] = 1;
                } else {
                    this.maskBorder[i] = 0;
                }
            }
        }

        return this.maskBorder;
    }	

	getMaskWandPart(index : number) {
		return this.maskWandParts[index];
	}

	getSelectionNr(x : number, y : number) {
		if (this.maskWand[y * this.width + x] == 1) {
			for (var i = 0; i < this.maskWandParts.length; i++) {
				if (this.maskWandParts[i][y * this.width + x] == 1) {
					return i;
				}
			}
		}
		
		return -1;		
	}

	mergeMaskWand() {
		var nrWandParts = this.maskWandParts.length;

		if (nrWandParts > 0) {
			for (var i = 0; i < this.maskWandParts[nrWandParts - 1].length; i++) {
				this.maskWand[i] = this.maskWand[i] || this.maskWandParts[nrWandParts - 1][i];
			}			
		}
	}

	setMaskBorder(maskBorder : Uint8Array) {
        if (this.width * this.height != maskBorder.length) {
            console.log("setMaskBorder: wrong mask sizes");
        } else {
            this.maskBorder = maskBorder;
        }		
	}

    setMaskWand(maskWand : Uint8Array) {
        if (this.width * this.height != maskWand.length) {
            console.log("setMaskWand: wrong mask sizes");
        } else {
            this.maskWand = maskWand;
        }
    }
}