/*
 * Project ariana
 * File: abstract-selection.ts
 * Author: Merwin van Dijk
 * Date: June 25th, 2015
 * Description: this file contains an abstract class for managing selections
 * with bitmask. All masks are 1-dimensional arrays. There are setters  for
 * maskWand, maskWandParts and maskBorder. The maskWand variable is an union
 * of differt mask wand parts.
 */

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

    /* Function assumes maskWand is set so borders can be determined from area in maskwand. */
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

    transform(layer : Layer, mouseX : number, mouseY : number) {
        var transformation = layer.calculateTransformation();
        // console.log("original", transformation);
        
        var transformation_y = -1 * transformation[7];
        var transformation_x = transformation[6];
        
        transformation[6] = 0;
        transformation[7] = 0;
        mat3.invert(transformation, transformation);
        mat3.transpose(transformation, transformation);
                
        var position = vec3.fromValues(mouseX - transformation_x, mouseY - transformation_y, 1);
        vec3.transformMat3(position, position, transformation);
        
        // FIXME only works in original state        
        // console.log("inverted", transformation);
        // console.log("position", position);
        var xRelative = Math.round(0.5 * (position[0] + 1) * this.width); 
        var yRelative = Math.round(0.5 * (position[1] + 1) * this.height);

        return new Point(xRelative, yRelative);
    }
}