
class Point {
    x : number;
    y : number;

    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

class MagicSelection {
    imageData : Uint8Array;
    magicWandColor : number[];
    bitmaskData : Uint8Array;
    treshold : number;
    bmON : number;
    width : number;
    height : number;

    constructor() {
        this.imageData = null;
        this.magicWandColor = null;
        this.treshold = 0.0;
        this.bmON = 255;
    }

    /* Given image data, pixel and treshold value a bitmask for the magic wand is returned.
     Algorithm checks for lines horizontally and adds line elements above and below to the
     stack when they match the color of the given point. */
    getSelection(imageData : Uint8Array, x : number, y : number, threshold : number, width : number, height : number) {
        this.treshold = threshold * 1020;

        var stack = [];
        var curLine = [];
        var newLine = [];
        this.width = width;
        this.height = height;

        this.imageData = imageData;

        /* Fill bitmask with zeros. */
        this.bitmaskData = new Uint8Array(imageData.length / 4);

        this.magicWandColor = this.getColorPoint(x, y);

        /* Use searchLine to get a horizontal line of points with colors next to given point
         and push to stack. */
        curLine = this.searchLine(x, y);
        stack.push(curLine);

        /* Keep popping line elements from stack until stack is empty. Push first all line elements
         above current line and then push all line elements below current line.  */
        while (stack.length > 0 && curLine != null) {
            curLine = stack.pop();

            for (var i = 0; i < curLine.length; i++) {
                /* Check if there is a line element above current position. */
                newLine = this.searchLine(curLine[i].x, curLine[i].y - 1);
                if (newLine != null) {
                    stack.push(newLine);
                }
            }

            for (var i = 0; i < curLine.length; i++) {
                /* Check if there is a line element below current position. */
                newLine = this.searchLine(curLine[i].x, curLine[i].y + 1);
                if (newLine != null) {
                    stack.push(newLine);
                }
            }
        }

        this.getBoundingPath();

        return this.bitmaskData;
    }

    /* Return array of points on same line as given point. */
    searchLine(startX : number, startY : number) {
        var line = [];
        var left : number = startX;
        var right : number = startX;

        /* Check if a valid position is given. */
        if (startY < 0 || startY >= this.height || startX < 0 || startX >= this.width ) {
            return null;
        }

        /* Check if point is marked in bitmaskData as part of the selection. */
        if (this.bitmaskData[startX + startY * this.width] != 0) {
            return null;
        }

        /* Check if point matches magicWandColor. */
        if (this.matchPoint(startX, startY) == false) {
            return null;
        }

        /* Search left from starting point. */
        for (var x = startX - 1; x >= 0; x--) {
            if (this.matchPoint(x, startY) == false) {
                left = x;
                break;
            }
        }

        /* Search right from starting point. */
        for (var x = startX + 1; x < this.width; x++) {
            if (this.matchPoint(x, startY) == false) {
                right = x;
                break;
            }
        }

        /* Make line by adding all points that are found and adjust bitmask */
        for (var x = left; x <= right; x++) {
            line.push(new Point(x, startY));
            this.bitmaskData[x + startY * this.width] = this.bmON;
        }

        return line;
    }

    getBoundingPath() {
        var newBMData = new Uint8Array(this.bitmaskData.length);

        /* Iterate over bitmaskData and possible adjust bits that are set. */
        for (var i = 0; i < this.bitmaskData.length ; i++) {
            if (this.bitmaskData[i] == this.bmON) {
                /* Check for borders of image (pixel on border of image is edge). */
                if (i % this.width == 0 &&
                    i % this.width == this.width - 1 &&
                    Math.floor( i / this.width) == 0 &&
                    Math.floor( i / this.width) == this.width - 1) {
                    newBMData[i] = this.bmON;
                    /* Check if 8 neighbor pixels are on, then it is an "inside" pixel. */
                } else if ( this.bitmaskData[i - this.width - 1] == 0 ||
                    this.bitmaskData[i - this.width ] == 0 ||
                    this.bitmaskData[i - this.width + 1] == 0 ||
                    this.bitmaskData[i - 1] == 0 ||
                    this.bitmaskData[i + 1] == 0 ||
                    this.bitmaskData[i + this.width - 1] == 0 ||
                    this.bitmaskData[i + this.width] == 0 ||
                    this.bitmaskData[i + this.width + 1] == 0 ) {
                    newBMData[i] = this.bmON;
                }
            }
        }

        /* Copy adjusted bitmask back bitmaskData class field. */
        //for (var i = 0; i < this.bitmaskData.length; i++) {
        //    this.bitmaskData[i] = newBMData[i];
        //}
        this.bitmaskData = newBMData;
    }

    getColorPoint(x : number, y : number) {
        var offset : number = (x + y * this.width) * 4;
        var Red : number	= this.imageData[offset];
        var Green : number	= this.imageData[offset + 1];
        var Blue  : number	= this.imageData[offset + 2];
        var Alpha : number	= this.imageData[offset + 3];

        return [Red, Green, Blue, Alpha];
    }

    matchPoint(x : number, y : number) {
        var curColor = this.getColorPoint(x, y);
        var value = 0.0;

        for (var i = 0; i < 4; i++) {
            value += Math.abs(this.magicWandColor[i] - curColor[i]);
        }

        return (value <= this.treshold);
    }
}