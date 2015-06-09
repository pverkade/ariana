/*
 * Project ariana
 * File: draw.ts
 * Author: Sjoerd Wenker
 * Date: June 3th, 2015
 * Description: this file contains a class to draw lines on a canvas.
 */

class Position2D {
    constructor (public x : number, public y : number) {

    }

    distanceTo (otherpoint : Position2D) {
        return Math.sqrt(Math.pow( otherpoint.x - this.x, 2) + Math.pow(otherpoint.y - this.y, 2));  
    }

    angleWith (otherpoint : Position2D) {
        return Math.atan2(otherpoint.x - this.x, otherpoint.y - this.y);
    }
}

/*
 * Class that defines a path
 */

class Path {
    path;
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
}

/*
 * Draw Types
 *
 * NORMAL : normal line (or a dot)
 * QUADRATIC_BEZIER : line using quadratic Bezier curves
 * BRUSH : Draw lines using a brush image
 * LINE : draw lines
 * RECTANGLE : draw rectangles
 * 
 */
enum drawType { NORMAL, QUADRATIC_BEZIER, BRUSH, LINE, RECTANGLE, CIRCLE };

/*
 * Brushes
 * TODO: add more brushes (and remove NORMAL, its color won't be changed while its not a svg image)
 * TODO: use drawType NORMAL if the brushType NORMAL is set..
 */
enum brushType { NORMAL, THIN, PEPPER, DUNES }

/*
 * Drawing class
 *
 * This class allows the user to draw lines, and anything else you can imagine,
 * on the canvas.
 *
 * TODO: - Polygone support?
 *       - Circle support
 *         - Fill and Fill with background-color
 *       - Text? ( https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D )
 *       - just a dot
 *       - Use secondary color at right mouseclick.
 *
 */
class Draw {

    isActive : boolean;
    isCleared : boolean = true; /* Boolean that tells the drawer if the canvas is cleared */
    lineWidth : number = 10;
    currentPath : Path;
    color : Color = new Color(255, 255, 255, 0.8);
    drawType : drawType = drawType.NORMAL;
    memCanvas : HTMLCanvasElement;
    memContext : CanvasRenderingContext2D;
    opacity : number = 0.6;
    brush : brushType;
    brushImage : HTMLImageElement;

    constructor(public canvas : HTMLCanvasElement) {
        this.memCanvas = document.createElement('canvas');
        this.memCanvas.width = canvas.width;
        this.memCanvas.height = canvas.height;
        this.memContext = <CanvasRenderingContext2D>this.memCanvas.getContext('2d');
    }

    /*
     * Function that is called at mousepress
     */
    onMousedown = (e : MouseEvent) : void => {

        if (!this.currentPath) {
            this.saveCanvas();
            this.currentPath = new Path(new Position2D(e.layerX, e.layerY));
            if (this.drawType == drawType.RECTANGLE || this.drawType == drawType.CIRCLE) {
                this.currentPath.addPosition(new Position2D(e.layerX, e.layerY));
            }
        }

        if (this.drawType == drawType.LINE) {
            this.currentPath.addPosition(new Position2D(e.layerX, e.layerY));
        }
    }

    /*
     * Function that is called at right mousepress
     */
    onContextMenu = (e : MouseEvent) : void => {
        e.preventDefault();

        this.onMousedown(e);
    }

    /*
     * Funtion that is called when the mouse is moved
     *
     * TODO: if drawType == drawType.LINE, replace last instead of adding new coords
     */
    onMousemove = (e : MouseEvent) : void => {
        if (this.currentPath) {
            /* If mouse button is upped outside of the canvas screen, stop drawing */
            if (e.buttons == 0) {
                this.currentPath = null;
                return;
            }

            if (this.drawType == drawType.LINE || this.drawType == drawType.RECTANGLE
                 || this.drawType == drawType.CIRCLE) {
                this.currentPath.setLastPosition(new Position2D(e.layerX, e.layerY));
            }
            else {
                this.currentPath.addPosition(new Position2D(e.layerX, e.layerY));
            }
            this.draw(this.currentPath);
        }
    }

    /*
     * Function being called when the mouse is no longer being pressed
     */
    onMouseup = (e : MouseEvent) : void => {
        if (this.drawType == drawType.RECTANGLE || this.drawType == drawType.CIRCLE) {
            this.currentPath.setLastPosition(new Position2D(e.layerX, e.layerY));
        }
        else if (this.drawType == drawType.LINE) {
            if (e.buttons > 0) {
                return;
            }
            this.currentPath.setLastPosition(new Position2D(e.layerX, e.layerY));
        }
        else {
            this.currentPath.addPosition(new Position2D(e.layerX, e.layerY));
        }

        this.draw(this.currentPath);
        this.currentPath = null;
    }

    /*
     * Function to activate the draw functionality
     */
    activate () : void {
        if (!this.isActive) {
            this.isActive = true;

            this.canvas.addEventListener("contextmenu", this.onContextMenu);
            this.canvas.addEventListener("mousedown", this.onMousedown);
            this.canvas.addEventListener("mousemove", this.onMousemove);
            this.canvas.addEventListener("mouseup", this.onMouseup);
        }
    }

    /*
     * Function to deactivate the draw functionality
     */
    deactivate () : void {
        if (this.isActive) {
            this.isActive = false;

            this.canvas.removeEventListener("contextmenu", this.onMousedown);
            this.canvas.removeEventListener("mousedown", this.onMousedown);
            this.canvas.removeEventListener("mousemove", this.onMousemove);
            this.canvas.removeEventListener("mouseup", this.onMouseup);
        }
    }

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
    setColor (color : Color) : void {
        this.color = color;
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
        this.opacity = opacity;
    }

    /*
     * Set the brush
     */
    setBrush (brush : brushType) : void {
        this.brush = brush;
        var brushImageURL : string = this.getBrushImage(brush);
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
        return 'assets/draw/normal.png';
    }

    /*
     * Function that is called if a brush is loaded
     */
    brushLoaded = () : void => {
        this.setDrawType(drawType.BRUSH);
    }

    /*
     * Save the canvas (use this before drawing)
     */
    saveCanvas = () : void => {
        this.memContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.memContext.drawImage(this.canvas, 0, 0);
    }

    /*
     * Reset the canvas to its original state (the saved state)
     */
    clearCanvas = () : void => {
        var context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        context.globalAlpha = 1.0;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(this.memCanvas, 0, 0);

        this.isCleared = true;

        if (this.currentPath) {
            this.currentPath.lastDrawnItem = 0;
        }
    }

    /*
     * Draw the given path to the canvas using the selected drawType
     */
    draw (path : Path) : void {
        var context = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        /* Append the right brush settings (TODO: is this the right place to do this?) */
        context.strokeStyle = this.color.getRGBA();
        context.lineWidth = this.lineWidth;
        context.lineCap = 'round'; //TODO: add other linecap options.
        context.globalAlpha = this.opacity;

        var points = path.path;

        /* Normal draw */
        if (this.drawType == drawType.NORMAL) {
            this.drawNormal(points, path, context);
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

        this.isCleared = false;
    }

    /*
     * Function to draw a line between each pixel
     */
    drawNormal (points, path : Path, context : CanvasRenderingContext2D) {

        return this.drawLines(points, context);
        /*var i : number = path.lastDrawnItem;

        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        for (i = i + 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.stroke();

        path.lastDrawnItem = i - 1;*/
    }

    /*
     * Smoother draw by using quadratic Bézier curves
     * TODO: use the path.lastDrawnItem ?
     */
    drawQuadraticBezierCurves (points, context : CanvasRenderingContext2D) {
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
    drawLines (points, context : CanvasRenderingContext2D) {
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
    drawRectangle (points, context : CanvasRenderingContext2D) {
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
    drawCircle (points, context : CanvasRenderingContext2D) {
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
    drawBrush (points, path : Path, context : CanvasRenderingContext2D) {
        var halfBrushW = this.brushImage.width/2;
        var halfBrushH = this.brushImage.height/2;
        var i : number = path.lastDrawnItem - 2;

        if (path.path.length < 3)
        {
            context.drawImage(this.brushImage, points[0].x - halfBrushW,
                                               points[0].y - halfBrushH);
        }
        if (i < 1) {
            i = 1;
        }
        
        /* Iterate over the not-drawn points in the path */
        for (i; i < points.length - 2; i++) {
            var start = points[i - 1];
            var end = points[i];
            
            var distance = parseInt(start.distanceTo(end));
            var angle = start.angleWith(end);
            
            var x, y;

            var zDiff : number = this.brushImage.width;
            if (this.brush == brushType.THIN) {
                zDiff = 1;
            }
            
            /* Draw images between the two points */
            for ( var z=0; (z<=distance || z==0); z += zDiff)
            {
                x = start.x + (Math.sin(angle) * z) - halfBrushW;
                y = start.y + (Math.cos(angle) * z) - halfBrushH;
                context.drawImage(this.brushImage, x, y);
            }
        }
        path.lastDrawnItem = i;
    }

    /*
     * Load svg to xml
     */
    loadBrushSVG (url : string) : void {
        var req : any;
        req = new XMLHttpRequest() || false;
        if(!req) {
            req = new ActiveXObject('Microsoft.XMLHTTP');
        }
        if (!req) return;

       req.open('GET', url, false);
       req.onreadystatechange = this.onSVGLoadReadyStateChange;
       req.send(null);
    }

    /*
     * If the svg is loaded, change its color to our color and assign it to the brush..
     * TODO: implement the brushSize / brushWidht / lineWidth in the svg
     *      (currently it supports only one size)
     */
    onSVGLoadReadyStateChange = (e : Event) : void => {
        var req : XMLHttpRequest = <XMLHttpRequest>e.target;
        if (req.readyState == 4 && req.status == 200)
        {
            var svg = req.responseXML;
            var paths = svg.getElementsByTagName('path');
            for (var i : number = 0; i < paths.length; i++) {
                paths[i].style.fill = this.getColorString();
            }

            var svgAsString = new XMLSerializer().serializeToString(svg);

            var svgBlob = new Blob([svgAsString], {type: "image/svg+xml;charset=utf-8"});
            var url = URL.createObjectURL(svgBlob);

            this.brushImage = new Image();
            this.brushImage.src = url;
            this.brushImage.addEventListener('load', this.brushLoaded);
        }
    }
}