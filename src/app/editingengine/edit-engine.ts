/// <reference path="../renderengine/layer"/>

class EditEngine {
    littleSquareDiameter = 4;
    rotateImage : HTMLImageElement;
    width : number;
    height : number;
    context : CanvasRenderingContext2D;

    constructor(canvas : HTMLCanvasElement) {
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.rotateImage = new Image();
        this.rotateImage.src = "/assets/vectors/rotate-left.svg";
    }

    resize (width : number, height : number) : void {
        this.width = width;
        this.height = height;
        this.clear();
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    private setColors(context : CanvasRenderingContext2D) {
        context.lineWidth = 1;
        context.fillStyle = "#FF0000";
        context.strokeStyle = "#FF0000";
    }

    drawTranslateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var dimensions = layer.getTransformedDimensions();
        var width = dimensions[0];
        var height = dimensions[1];
        var rotation = layer.getRotation();

        this.clear();

        context.save();
        this.setColors(context);
        context.translate(x, y);
        //context.rotate(-rotation);
        context.strokeRect(-width * 0.5, -height * 0.5, width, height);
        context.fillRect(
            -this.littleSquareDiameter * 0.5,
            -this.littleSquareDiameter * 0.5,
            this.littleSquareDiameter,
            this.littleSquareDiameter
        );
        context.restore();
    }

    drawRotateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var dimensions = layer.getTransformedDimensions();
        var rotation = layer.getRotation();
        var width  = dimensions[0];
            //(1 / (Math.cos(rotation) * Math.cos(rotation) - Math.sin(rotation) * Math.sin(rotation))) *
            //(dimensions[0] * Math.abs(Math.cos(rotation)) - dimensions[1] * Math.abs(Math.sin(rotation)));
        var height = dimensions[1];
            //(1 / (Math.cos(rotation) * Math.cos(rotation) - Math.sin(rotation) * Math.sin(rotation))) *
            //(- dimensions[0] * Math.abs(Math.sin(rotation)) + dimensions[1] * Math.abs(Math.cos(rotation)));
        
        this.clear();

        context.save();
        this.setColors(context);
        context.translate(x, y);
        //context.rotate(-rotation);
        context.strokeRect(-width * 0.5, -height * 0.5, width, height);
        context.fillRect(
            -this.littleSquareDiameter * 0.5,
            -this.littleSquareDiameter * 0.5,
            this.littleSquareDiameter,
            this.littleSquareDiameter
        );
        context.drawImage(this.rotateImage, this.rotateImage.width / -2.0, height/-2.0 - 30);
        context.restore();
    }

    drawScaleTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var dimensions = layer.getTransformedDimensions();
        var width = dimensions[0];
        var height = dimensions[1];
        var rotation = layer.getRotation();

        this.clear();

        context.save();
        this.setColors(context);
        context.translate(x, y);
        //context.rotate(-rotation);
        context.strokeRect(-width * 0.5, -height * 0.5, width, height);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                context.fillRect(
                    -width * 0.5 * i - this.littleSquareDiameter * 0.5,
                    -height * 0.5 * j - this.littleSquareDiameter * 0.5,
                    this.littleSquareDiameter,
                    this.littleSquareDiameter
                );
            }
        }
        context.restore();
    }
}