/*
 * Project ariana
 * File: marching-ants.ts
 * Author: Merwin van Dijk
 * Date: June 25th, 2015
 * Description: this file contains the marching ants class which is
 * responsible for writing ants on the borders of selections. The 
 * mask borders can be set and a the ants can be written in a given
 * image data object according to size and offset.
 */

class MarchingAnts {
    width : number;
    height : number;
    maskBorder : Uint8Array;

    constructor(width : number, height : number) {
        this.width = width;
        this.height = height;
    }

    setMaskBorder(maskBorder : Uint8Array) {
        this.maskBorder = maskBorder;
    }

    writeData(imageData : ImageData, size : number, offset : number) : void {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var val;
                if (this.maskBorder[i*this.width + j] == 0) {
                    val = 0;
                } else if ((i + j + offset) % size < size / 2) {
                    val = 255;
                } else {
                    val = 0;
                }
                imageData.data[(i * this.width + j) * 4 + 3] = val;
            }
        }
    }
}