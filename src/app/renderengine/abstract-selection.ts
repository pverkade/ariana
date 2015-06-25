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

    sign(x : number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

    /* Removes last added mask wand from maskWandParts and maskWand. After that 
        calculate borders from new mask wand. */
    clearLast() : boolean {
        var nrWands = this.maskWandParts.length;

        if (nrWands < 1) {
            return false;
        }

        for (var i = 0; i < this.maskWandParts[nrWands - 1].length; i++) {
            if (this.maskWandParts[nrWands-1][i] == 1) {
                this.maskWand[i] = 0;
            }
        }
        this.maskWandParts.splice(nrWands - 1, 1);

        this.getMaskBorder();

        return true;
    }

    /* Function assumes maskWand so borders can be determined from area in maskwand. */
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
            } else {
                this.maskBorder[i] = 0;
            }
        }

        return this.maskBorder;
    } 

    /* Return true when point is within selection. */
    isInSelection(x : number, y : number) {
        if (this.maskWandParts.length > 0 && this.maskWand[y * this.width + x] != 0) {
            return true;
        } else {
            return false;
        }
    }

    /* Merge last added mask wand part with mask wand. */
    mergeMaskWand() {
        var nrWandParts = this.maskWandParts.length;

        if (nrWandParts > 0) {
            for (var i = 0; i < this.maskWandParts[nrWandParts - 1].length; i++) {
                this.maskWand[i] = this.maskWand[i] || this.maskWandParts[nrWandParts - 1][i];
            }           
        }
    }

    /* Remove bitmask of wand that contains point. Do not remove first bitmask
        but adjust to the missing bitmask. */
    removeSelection(startX : number, startY : number) {
        var indexRemove = -1;

        for (var i = 0; i < this.maskWandParts.length; i++) {
            if (this.maskWandParts[i][startY * this.width + startX] != 0) {
                indexRemove = i;
            }
        }

        if (indexRemove != -1){
            for (var i = 0; i < this.maskWandParts[indexRemove].length; i++) {
                if (this.maskWandParts[indexRemove][i] == 1) {
                    this.maskWand[i] = 0;
                }
            }

            this.maskWandParts.splice(indexRemove, 1);
        }

        this.getMaskBorder();

        return indexRemove;
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

    setMaskWandParts(maskWandParts : Uint8Array[]) {
        this.maskWandParts = maskWandParts;
    } 

    getWidth() {
        return this.width;
    }
    
    getHeight() {
        return this.height;
    }

    getNrWands() {
        return this.maskWandParts.length;
    }

    getLastMaskWand() {
        return this.maskWandParts[this.maskWandParts.length - 1];           
    }
}