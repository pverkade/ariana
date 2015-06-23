

class MaskSelection {
    private maskWand : Uint8Array;
    private maskBorder : Uint8Array;
    private width : number;
    private height : number;
    private bmON : number;

    constructor(maskBorder : Uint8Array, width : number, height : number) {
        this.width = width;
        this.height = height;
        this.bmON =1;

        this.maskBorder = maskBorder;
        this.maskWand = new Uint8Array(width * height); // [];
        // for (var i = 0; i < width * height; i++) {
        // 	this.maskWand.push(0);
        // }
        // this.maskWand[0] = new Uint8Array(width * height);
    }

    getMaskWand(x : number, y : number) {
        var stack = [];
        var curLine = [];
        var newLine = [];

        /* Create new empty maskWand for selection. */
        // this.maskWand.push(new Uint8Array(this.maskWand[0].length));

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
        
        /* Merge maskWand[0] with current maskWand. */
        // this.mergeMaskWand();

        /* Return current maskWand. */
        return this.maskWand; // [this.maskWand.length - 1];
    }

    /* Return array of points on same line as given point. */
    searchLine(startX : number, startY : number) {
        var line = [];
        var left = startX;
        var right = startX;
    
        /* Check if a valid position is given. */
        if (startY < 0 || startY >= this.height || startX < 0 || startX >= this.width ) {
            return null;
        }
        // console.log("testest5");
       // console.log( this.maskWand.length);
       // console.log( this.maskWand[startX + startY * this.width] );
        /* Check if point is marked in current maskWand as part of the selection. */ 
        if (this.maskWand[startX + startY * this.width] != 0) { // [this.maskWand.length - 1]
            return null;
        }

        /* Check if point matches magicWandColor. */
        if (this.matchPoint(startX, startY) == false) {
            return null;
        }

        // console.log("testest");
        /* Search left from starting point. */
        for (var x = startX - 1; x >= 0; x--) {
            if (this.matchPoint(x, startY) == false) {
                left = x + 1;
                break;
            } else if( x == 0) {
                left = 0;
                break;
            }
        }

        /* Search right from starting point. */
        for (var x = startX + 1; x < this.width; x++) {
            if (this.matchPoint(x, startY) == false) {
                right = x - 1;
                break;
            } else if( x == this.width - 1) {
                right = this.width - 1;
                break;
            }
        }
        
        /* Make line by adding all points that are found and adjust bitmask */
        for (var x = left; x <= right; x++) {
            line.push(new Point(x, startY));
            this.maskWand[x + startY * this.width] = this.bmON; // [this.maskWand.length - 1]
            // console.log("teo");
        }

        return line;
    }

    /* Return RGB values of point. */
    getColorPoint(x : number, y : number) {
        return this.maskBorder[y * this.width + x];
    }   

    matchPoint(x : number, y : number) {
        var value = this.getColorPoint(x, y);
        return value == 0;
    }
}