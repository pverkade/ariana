/*
 * Project ariana
 * File: draw.ts
 * Author: Sjoerd Wenker
 * Date: June 3th, 2015
 * Description: this file contains a class to draw lines on a canvas.
 */

/*
 * Position2D class for addressing a point in the draw canvas.
 */
class Position2D {
    constructor (public x : number, public y : number) {

    }

    distanceTo (otherpoint : Position2D) : number {
        return Math.sqrt(Math.pow( otherpoint.x - this.x, 2) + Math.pow(otherpoint.y - this.y, 2));  
    }

    angleWith (otherpoint : Position2D) : number {
        return Math.atan2(otherpoint.x - this.x, otherpoint.y - this.y);
    }

    pointInDirection (otherpoint : Position2D, distance : number) : Position2D {
        var dx : number = otherpoint.x - this.x;
        var dy : number = otherpoint.y - this.y;

        var origDistance : number = this.distanceTo(otherpoint);

        if (distance == origDistance) {
            return otherpoint;
        }
        if (distance == 0.0) {
            return otherpoint;
        }

        var fraction : number = distance / origDistance;

        var newX : number = this.x + fraction * dx;
        var newY : number = this.y + fraction * dy;

        return new Position2D(newX, newY);

    }
}

/*
 * Class that defines a path
 * TODO: add function that generates a smooth path between the points using Bezier curves?
 * Maybe look at the canvas beginPath etc for inspiration (and use bitmaps to not overdraw itself)
 */

class Path {
    path : Array<Position2D>;
    lastDrawnItem : number = 0;

    constructor (public start : Position2D) {
        this.path  = [];
        this.path.push(start);
    }

    addPosition (position : Position2D) : void {
        this.path.push(position);
    }

    setLastPosition (position : Position2D) : void {
        this.path[this.length() - 1] = position;
    }

    length () : number {
        return this.path.length;
    }
}

/*
 * Class that defines a color
 */
class Color {

    constructor (public r : number, public g : number, public b : number, public a : number) {

    }

    getRGBA () {
        return 'rgba('+ this.r + ', '+ this.g + ', '+ this.b + ', '+ this.a + ')';
    }

    getRGBWithOpacity (alpha : number) {
        return 'rgba('+ this.r + ', '+ this.g + ', '+ this.b + ', '+ alpha + ')';
    }
}

/*
 * Draw Types
 *
 * NORMAL : normal line (or a dot)
 * QUADRATIC_BEZIER : line using quadratic Bezier curves
 * BRUSH : Draw lines using a brush image
 * LINE : draw lines
 * RECTANGLE : draw rectangles
 * CIRCLE : draw a circle
 * 
 */
enum drawType { NORMAL, DASHED, QUADRATIC_BEZIER, BRUSH, LINE, RECTANGLE, CIRCLE };

/*
 * Brushes
 *
 * THIN : thin line,
 * PEPPER : pepper symbol
 * DUNES : dune structure
 * PEN : line with changing width
 * NEIGHBOR : stroke nearby lines
 * FUR : fur effect with nearby points
 */
enum brushType { THIN, PEPPER, DUNES, PEN, NEIGHBOR, FUR, MULTISTROKE }

/*
 * Drawing class
 *
 * This class allows the user to draw lines, and anything else you can imagine,
 * on the canvas.
 */
class DrawEngine {

    isActive : boolean;
    isCleared : boolean = true; /* Boolean that tells the drawer if the canvas is cleared */
    currentPath : Path;

    /* Information about the drawstyle */
    drawType : drawType = drawType.NORMAL;
    color : Color = new Color(255, 255, 255, 1.0);
    opacity : number = 1.0;
    lineWidth : number = 5;

    brush : brushType;
    brushImage : HTMLImageElement;

    /* Canvas elements and its contexts */
    memCanvas : HTMLCanvasElement;
    memContext : CanvasRenderingContext2D;
    drawCanvas : HTMLCanvasElement;
    drawContext : CanvasRenderingContext2D;
    tmpDrawCanvas : HTMLCanvasElement;
    tmpDrawContext : CanvasRenderingContext2D;

    width : number;
    height : number;

    dashedDistance : number;

    constructor(canvas : HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        console.log(this.width);
        this.drawCanvas = canvas;

        this.memCanvas = document.createElement('canvas');
        this.memCanvas.width = this.width;
        this.memCanvas.height = this.height;
        this.memContext = <CanvasRenderingContext2D>this.memCanvas.getContext('2d');
        this.drawContext = <CanvasRenderingContext2D>this.drawCanvas.getContext('2d');

        this.dashedDistance = 0.0;

        this.tmpDrawCanvas = document.createElement('canvas');
        this.tmpDrawCanvas.width = this.width;
        this.tmpDrawCanvas.height = this.height;
        this.tmpDrawContext = <CanvasRenderingContext2D>this.tmpDrawCanvas.getContext("2d");
    }

    resize (width : number, height : number) : void {
        this.memCanvas.width = width;
        this.memCanvas.height = height;
        this.tmpDrawCanvas.width = width;
        this.tmpDrawCanvas.height = height;
        console.log("resize:" + width + ", " + height);
        this.clearCanvases();
    }
    
    /*
     * Function that is called at mousepress
     */
    onMousedown = (x : number, y : number) : void => {
        if (!this.currentPath) {
            this.dashedDistance = 0.0;
            this.saveCanvas();
            this.currentPath = new Path(new Position2D(x, y));
            if (this.drawType == drawType.RECTANGLE || this.drawType == drawType.CIRCLE) {
                this.currentPath.addPosition(new Position2D(x, y));
            }
        }

        if (this.drawType == drawType.LINE) {
            this.currentPath.addPosition(new Position2D(x, y));
        }
    };

    /*
     * Funtion that is called when the mouse is moved
     */
    onMousemove = (x : number, y : number) : void => {
        if (this.currentPath) {

            if (this.drawType == drawType.LINE || this.drawType == drawType.RECTANGLE
                 || this.drawType == drawType.CIRCLE) {
                this.currentPath.setLastPosition(new Position2D(x, y));
            }
            else {
                this.currentPath.addPosition(new Position2D(x, y));
            }
            this.draw(this.currentPath);
        }
    };

    /*
     * Function being called when the mouse is no longer being pressed
     */
    onMouseup =  (x : number, y : number) : void => {
        if (!this.currentPath) return;
        
        if (this.drawType == drawType.RECTANGLE || this.drawType == drawType.CIRCLE) {
            this.currentPath.setLastPosition(new Position2D(x, y));
        }
        else if (this.drawType == drawType.LINE) {
            this.currentPath.setLastPosition(new Position2D(x, y));
        }
        else {
            this.currentPath.addPosition(new Position2D(x, y));
        }

        this.draw(this.currentPath);
        this.currentPath = null;
    };

    /*
     * Set the size of the brush/line
     */
    setLineWidth (size : number) : void {
        this.lineWidth = size;
    }

    /*
     * Set the draw type (normal, quadratic_bezier, brush, line)..
     */
    setDrawType (drawType : drawType) : void {
        this.drawType = drawType;
    }

    /*
     * Set the color of the line
     */
    setColor (r : number, g : number, b : number, a : number) : void {
        this.color = new Color(r, g, b, a);
        if (this.drawType == drawType.BRUSH) {
            this.setBrush(this.brush);
        }
    }

    /*
     * getColorString
     */
    getColorString () : string {
        return this.color.getRGBA();
    }

    /*
     * Set the opacity
     */
    setOpacity (opacity : number) : void {
    	if (opacity < 0.8) {
    		this.opacity = opacity / 8;
    	}
    	else {
    		this.opacity = 4.5 * opacity - 3.5;
    	}
    }

    /*
     * Set the brush
     */
    setBrush (brush : brushType) : void {
        this.brush = brush;
        var brushImageURL : string = this.getBrushImage(brush);
        if (brushImageURL == null) {
            return;
        }
        if (brushImageURL.indexOf('.svg') > 0) {
            return this.loadBrushSVG(brushImageURL);
        }
        this.brushImage = new Image();
        this.brushImage.src = brushImageURL;
        this.brushImage.addEventListener('load', this.brushLoaded);
    }

    /*
     * Get the brush image url
     */
    getBrushImage (brush : brushType) : string {
        if (brush == brushType.THIN) {
            return 'assets/draw/thin.svg';
        }
        if (brush == brushType.PEPPER) {
            return 'assets/draw/pepper.png';
        }
        if (brush == brushType.DUNES) {
            return 'assets/draw/dunes.svg';
        }
        this.setDrawType(drawType.BRUSH);
        return null;
    }

    /*
     * Function that is called if a brush is loaded
     */
    brushLoaded = () : void => {
        this.setDrawType(drawType.BRUSH);
    };

    /*
     * Save the canvas (use this before drawing)
     */
    saveCanvas = () : void => {
        this.memContext.clearRect(0, 0, this.width, this.height);
        this.memContext.drawImage(this.drawCanvas, 0, 0);
    };

    /*
     * Reset the canvas to its original state (the saved state)
     */
    clearCanvas = () : void => {
        var context =  this.drawContext;
        context.globalAlpha = 1.0;
        context.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        context.drawImage(this.memCanvas, 0, 0);

        this.isCleared = true;

        if (this.currentPath) {
            this.currentPath.lastDrawnItem = 0;
        }
    };

    clearCanvases() : void {
        this.memContext.clearRect(0, 0, this.memCanvas.width, this.memCanvas.height);
        this.clearCanvas();
    }

    /*
     * Function to call when the drawing must be saved to the renderengine.
     */
    getCanvasImageData () : ImageData {
        if (this.drawCanvas)
            return this.drawContext.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        
        return null;
    }

    /*
     * Draw the given path to the canvas using the selected drawType
     */
    draw (path : Path) : void {
        var context = this.tmpDrawContext;
        if (context == null) {
            console.log("Can't draw path, canvas is already rendered in webgl mode.")
            return;
        }

        /* Append the right brush settings */
        context.strokeStyle = this.color.getRGBA();
        context.lineWidth = this.lineWidth;
        context.lineCap = 'round'; //TODO: add other linecap options.
        context.globalAlpha = this.opacity;

        var points = path.path;

        /* Normal draw */
        if (this.drawType == drawType.NORMAL) {
            this.drawNormal(points, path, context);
        }

        /* Draw dashed line */
        if (this.drawType == drawType.DASHED) {
            this.drawDashedLine(points, path, context);
        }

        /* Smoother draw by using quadratic Bézier curves */
        if (this.drawType == drawType.QUADRATIC_BEZIER) {
            this.drawQuadraticBezierCurves(points, context);
        }

        /*
         * Paint brush.. 
         */
        if (this.drawType == drawType.BRUSH) {
            this.drawBrush(points, path, context);
        }

        /*
         * Draw a line between the first and last point in a path
         */
        if (this.drawType == drawType.LINE) {
            this.drawLines(points, context);
        }

        /*
         * Draw a rectangle
         */
        if (this.drawType == drawType.RECTANGLE) {
            this.drawRectangle(points, context);
        }

        /*
         * Draw a circle
         */
        if (this.drawType == drawType.CIRCLE) {
            this.drawCircle(points, context);
        }

        /*
         * Erase some drawn things
         */
        //if (this.drawType == drawType.ERASE) {
        //    this.erasePath(points, path, context);
        //}


        this.drawContext.drawImage(this.tmpDrawCanvas, 0, 0);

        this.isCleared = false;
    }

    /*
     * Function to draw a line between each pixel
     */
    drawNormal (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {
        var i : number = path.lastDrawnItem;

        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        for (i = i + 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.stroke();

        path.lastDrawnItem = i - 1;
    }

    /*
     * Draw a dashed line (black and white) for the magic selection
     */
    drawDashedLine (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {
        var nrLastDrawn : number = path.lastDrawnItem;

        for (var i = nrLastDrawn + 1; i < points.length; i++) {
            var lastPoint : Position2D = points[i-1];
            var nextPoint : Position2D;
            
            while (lastPoint.distanceTo(points[i]) > 0) {
                if (lastPoint.distanceTo(points[i]) > 5 - this.dashedDistance % 5) {
                    nextPoint = lastPoint.pointInDirection(points[i], 5 - this.dashedDistance % 5);
                }
                else {
                    nextPoint = points[i];
                }

                context.beginPath();
                context.moveTo(lastPoint.x, lastPoint.y);
                if (this.dashedDistance % 10 >= 5.0) {
                    context.strokeStyle = 'rgba(0,0,0,255)';
                }
                else {
                    context.strokeStyle = 'rgba(255,255,255,255)';
                }
                context.lineTo(nextPoint.x, nextPoint.y);
                context.stroke();

                if (nextPoint == points[i]) {
                    this.dashedDistance += lastPoint.distanceTo(points[i]);
                    break;
                }
                this.dashedDistance += 5 - this.dashedDistance % 5;
                lastPoint = nextPoint;
            }

        }

        path.lastDrawnItem = points.length - 1;
    }

    /*
     * Smoother draw by using quadratic Bézier curves
     * TODO: use the path.lastDrawnItem ?
     */
    drawQuadraticBezierCurves (points : Array<Position2D>, context : CanvasRenderingContext2D) {
        if (!this.isCleared) {
            this.clearCanvas();
        }

        if (points.length < 2) {
            var b = points[0];
            context.beginPath();
            context.arc(b.x, b.y, context.lineWidth / 2, 0, Math.PI * 2, !0);
            context.closePath();
            context.fill();
            return;
        }
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        
        /* Draw quadratic curves between each point */
        for (var i : number = 1; i < points.length - 2; i++) {
            var c = (points[i].x + points[i + 1].x) / 2,
                d = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, c, d);
        }
        context.quadraticCurveTo(points[points.length-2].x, points[points.length-2].y,
                                 points[points.length-1].x, points[points.length-1].y);
        context.stroke();
    }

    /*
     * Function to draw lines by given points to a given canvas-context
     */
    drawLines (points : Array<Position2D>, context : CanvasRenderingContext2D) {
        if (!this.isCleared) {
            this.clearCanvas();
        }

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (var i : number = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.stroke();
    }

    /*
     * Function to draw a rectangle
     */
    drawRectangle (points : Array<Position2D>, context : CanvasRenderingContext2D) {
        if (!this.isCleared) {
            this.clearCanvas();
        }

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[0].x, points[1].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[1].x, points[0].y);
        context.lineTo(points[0].x, points[0].y);
        context.stroke();
    }

    /*
     * Function to draw a circle
     */
    drawCircle (points : Array<Position2D>, context : CanvasRenderingContext2D) {
        if (!this.isCleared) {
            this.clearCanvas();
        }

        //TODO: the circle gets bigger than the distance of the cursor..
        var radius = Math.sqrt(Math.pow(points[0].x - points[1].x, 2) + Math.pow(points[0].y - points[1].y, 2)) / 2;

        var width : number = points[0].x - points[1].x;
        var height : number = points[0].y - points[1].y;

        var centerX : number = points[0].x + (width > 0 ? -radius : radius);
        var centerY : number = points[0].y + (height > 0 ? -radius : radius);

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.stroke();
    }

    /*
     * Function to draw brush..
     */
    drawBrushImage (points, path : Path, context : CanvasRenderingContext2D) {
        var timingStart = performance.now();
        var halfBrushW = this.brushImage.width/2;
        var halfBrushH = this.brushImage.height/2;
        var i : number = path.lastDrawnItem - 2;

        var brushCanvas = document.createElement("canvas");
        brushCanvas.width = this.lineWidth;
        brushCanvas.height = this.lineWidth;
        var brushContext = brushCanvas.getContext("2d");
        brushContext.drawImage(this.brushImage, 0, 0, this.lineWidth, this.lineWidth);

        if (path.path.length < 3)
        {
            context.drawImage(
                brushCanvas,
                points[0].x - halfBrushW,
                points[0].y - halfBrushH
            );
        }
        if (i < 1) {
            i = 1;
        }

        var timing1 = performance.now() - timingStart;

        /* Iterate over the not-drawn points in the path */
        for (i; i < points.length - 2; i++) {
            var start = points[i - 1];
            var end = points[i];
            
            var distance : number = start.distanceTo(end);
            var angle = start.angleWith(end);
            
            var x, y;

            var zDiff : number = this.brushImage.width;
            if (this.brush == brushType.THIN) {
                zDiff = 1;
            }
            
            /* Draw images between the two points */
            for ( var z=0; (z<=distance || z==0); z += zDiff)
            {
                x = start.x + (Math.sin(angle) * z) - halfBrushW + 5;
                y = start.y + (Math.cos(angle) * z) - halfBrushH + 5;
                context.drawImage(brushCanvas, x, y);
            }
        }

        var timing2 = performance.now() - timingStart;
        console.log("Timing 1: " + timing1);
        console.log("Timing 2: " + timing2);
        path.lastDrawnItem = i;
    }


    drawBrush (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {
        if (this.brush == brushType.THIN || this.brush == brushType.PEPPER || this.brush == brushType.DUNES) {
            return this.drawBrushImage(points, path, context);
        }

        if (this.brush == brushType.PEN) {
            return this.drawBrushPen(points, path, context);
        }

        if (this.brush == brushType.NEIGHBOR) {
            return this.drawBrushNeighbor(points, path, context);
        }

        if (this.brush == brushType.FUR) {
            return this.drawBrushFur(points, path, context);
        }

        if (this.brush == brushType.MULTISTROKE) {
            return this.drawBrushMultiStroke(points, path, context);
        }
    }

    drawBrushPen (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {

        var i : number = path.lastDrawnItem;

        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        for (i = i + 1; i < points.length; i++) {
            context.lineWidth = (Math.random() * 0.4 + 0.8) * this.lineWidth;
            context.lineTo(points[i].x, points[i].y);
        }
        context.stroke();

        path.lastDrawnItem = i - 1;
    }

    drawBrushNeighbor (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {

        var i : number = path.lastDrawnItem;

        if (i == 0) {
            i = 1;
        }

        for (; i > 0 && i < points.length; i++) {

            var lastpoint = points[i];
            context.beginPath();
            context.strokeStyle = this.color.getRGBA();
            context.lineWidth = this.lineWidth;
            context.moveTo(points[i - 1].x, points[i - 1].y);
            context.lineTo(lastpoint.x, lastpoint.y);
            context.stroke();

            for (var j = 0; j < i; j++) {

                var dx = points[j].x - lastpoint.x;
                var dy = points[j].y - lastpoint.y;

                if (lastpoint.distanceTo(points[j]) < 32) {
                    context.beginPath();
                    context.strokeStyle = this.color.getRGBWithOpacity(0.3);
                    context.lineWidth = Math.ceil(this.lineWidth / 10);
                    context.moveTo( lastpoint.x + (dx * 0.2), lastpoint.y + (dy * 0.2));
                    context.lineTo( points[j].x - (dx * 0.2), points[j].y - (dy * 0.2));
                    context.stroke();
                }
            }
        }

        path.lastDrawnItem = i;
    }

    drawBrushFur (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {

        var i : number = path.lastDrawnItem;

        if (i == 0) {
            i = 1;
        }

        for (; i > 0 && i < points.length; i++) {

            var lastpoint = points[i];
            context.beginPath();
            context.strokeStyle = this.color.getRGBA();
            context.lineWidth = this.lineWidth;
            context.moveTo(points[i - 1].x, points[i - 1].y);
            context.lineTo(lastpoint.x, lastpoint.y);
            context.stroke();

            for (var j = 0; j < i; j++) {

                var dx = points[j].x - lastpoint.x;
                var dy = points[j].y - lastpoint.y;
                
                var distance = lastpoint.distanceTo(points[j]);

                if (distance < 32 && Math.random() > distance / 64) {
                    context.beginPath();
                    context.strokeStyle = this.color.getRGBWithOpacity(0.3);
                    context.lineWidth = Math.ceil(this.lineWidth / 10);
                    context.moveTo( lastpoint.x + (dx * 0.5), lastpoint.y + (dy * 0.5));
                    context.lineTo( lastpoint.x - (dx * 0.5), lastpoint.y - (dy * 0.5));
                    context.stroke();
                }
            }
        }

        path.lastDrawnItem = i;
    }

    drawBrushMultiStroke (points : Array<Position2D>, path : Path, context : CanvasRenderingContext2D) {

        var i : number = path.lastDrawnItem;

        context.beginPath();
        for (i = i + 1; i < points.length; i++) {
  
          context.moveTo(points[i-1].x - this.getRandomInt(0, 2), points[i-1].y - this.getRandomInt(0, 2));
          context.lineTo(points[i].x - this.getRandomInt(0, 2), points[i].y - this.getRandomInt(0, 2));
          context.stroke();
          
          context.moveTo(points[i-1].x, points[i-1].y);
          context.lineTo(points[i].x, points[i].y);
          context.stroke();
          
          context.moveTo(points[i-1].x + this.getRandomInt(0, 2), points[i-1].y + this.getRandomInt(0, 2));
          context.lineTo(points[i].x + this.getRandomInt(0, 2), points[i].y + this.getRandomInt(0, 2));
          context.stroke();

        }
        context.stroke();

        path.lastDrawnItem = i - 1;
    }

    getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*
     * Load svg to xml
     */
    loadBrushSVG (url : string) : void {
        var thisPointer = this;
        $.get(
            url,
            function(data) {
                var paths = data.getElementsByTagName("path");
                for (var i = 0; i < paths.length; i++) {
                    paths[i].style.fill = thisPointer.getColorString();
                }

                var dataString = new XMLSerializer().serializeToString(data);
                var src = 'data:image/svg+xml;base64,' + window.btoa(dataString);
                thisPointer.brushImage = new Image();
                thisPointer.brushImage.src = src;
                thisPointer.brushLoaded();
            }
        );
    }
}
