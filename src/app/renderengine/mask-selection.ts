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
        this.maskWand = new Uint8Array(width * height);
    }

    getMaskWand(x : number, y : number) {
        var stack = [];
        var curLine = [];
        var newLine = [];

        /* Use searchLine to get a horizontal line of points with zeros
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
        
        return this.maskWand; 
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

        /* Check if point is marked in current maskWand as part of the selection. */ 
        if (this.maskWand[startX + startY * this.width] != 0) { // [this.maskWand.length - 1]
            return null;
        }

        /* Check if point matches magicWandColor. */
        if (this.matchPoint(startX, startY) == false) {
            return null;
        }

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
        }

        return line;
    }

    matchPoint(x : number, y : number) {
        var value = this.maskBorder[y * this.width + x];
        return value == 0;
    }
}