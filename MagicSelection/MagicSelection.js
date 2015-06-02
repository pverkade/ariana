var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();
var MagicSelection = (function () {
    function MagicSelection() {
        this.imageData = null;
        this.magicWandColor = null;
        this.bitMaskData = null;
        this.treshold = 0.0;
    }
    /* Given image data, pixel and treshold value a bitmask for the magic wand is returned.
        Algorithm checks for lines horizontally and adds line elements above and below to the
        stack when they match the color of the given point. */
    MagicSelection.prototype.getSelection = function (imageData, x, y, treshold) {
        var stack = [];
        var curLine = [];
        var newLine = [];
        this.imageData = imageData;
        /* Fill bitmask with zeros. */
        for (var i = 0; i < imageData.data.length; i++) {
            this.bitMaskData.push(0);
        }
        this.magicWandColor = this.getColorPoint(x, y);
        /* Use searchLine to get a horizontal line of points with colors next to given point. */
        curLine = this.searchLine(x, y);
        stack.push(curLine);
        /* Keep popping line elements from stack until stack is empty. */
        while (stack.length > 0) {
            curLine = stack.pop();
            for (var i = 0; i < curLine.length; i++) {
                this.bitMaskData[curLine[i].x + curLine[i].y * imageData.width] = 255;
                /* Check if there is a line element above current position. */
                newLine = this.searchLine(x, y - 1);
                if (newLine != null) {
                    stack.push(newLine);
                }
                /* Check if there is a line element below current position. */
                newLine = this.searchLine(x, y + 1);
                if (newLine != null) {
                    stack.push(newLine);
                }
            }
        }
        return this.bitMaskData;
    };
    /* Return array of points on same line as given point. */
    MagicSelection.prototype.searchLine = function (startX, startY) {
        var line;
        var left = startX;
        var right = startY;
        /* Check if a valid position is given. */
        if (startY < 0 || startY >= this.imageData.height || startX < 0 || startX >= this.imageData.width) {
            return null;
        }
        /* Check if point is marked in bitMaskData as part of the selection. */
        if (this.bitMaskData[x + startY * this.imageData.width] != 0) {
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
        for (var x = startX + 1; x < this.imageData.width; x++) {
            if (this.matchPoint(x, startY) == false) {
                right = x;
                break;
            }
        }
        /* Make line by adding all ... */
        for (var x = left; x <= right; x++) {
            line.push(new Point(x, startY));
        }
        return line;
    };
    MagicSelection.prototype.getColorPoint = function (x, y) {
        var Red = this.imageData.data[(x + y * this.imageData.width) * 4];
        var Green = this.imageData.data[(x + y * this.imageData.width) * 4 + 1];
        var Blue = this.imageData.data[(x + y * this.imageData.width) * 4 + 2];
        var Alpha = this.imageData.data[(x + y * this.imageData.width) * 4 + 3];
        return [Red, Green, Blue, Alpha];
    };
    MagicSelection.prototype.matchPoint = function (x, y) {
        var curColor = this.getColorPoint(x, y);
        var value = 0.0;
        for (var i = 0; i < 4; i++) {
            value += Math.abs(this.magicWandColor[i] - curColor[i]);
        }
        value /= 4.0 * 255.0;
        if (value <= this.treshold) {
            return true;
        }
        else {
            return false;
        }
    };
    return MagicSelection;
})();
