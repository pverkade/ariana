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

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawTranslateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();

        this.clear();

        context.save();
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width/2.0, -height/2.0, width, height);
        context.fillRect(
            -this.littleSquareDiameter / 2.0,
            -this.littleSquareDiameter / 2.0,
            this.littleSquareDiameter,
            this.littleSquareDiameter
        );
        context.restore();
    }

    drawRotateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();

        this.clear();

        context.save();
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width/2.0, -height/2.0, width, height);
        context.fillRect(
            -this.littleSquareDiameter / 2.0,
            -this.littleSquareDiameter / 2.0,
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
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();

        this.clear();

        context.save();
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width/2.0, -height/2.0, width, height);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                context.fillRect(
                    -width / 2.0 * i - this.littleSquareDiameter / 2.0,
                    -height / 2.0 * j - this.littleSquareDiameter / 2.0,
                    this.littleSquareDiameter,
                    this.littleSquareDiameter
                );
            }
        }
        context.restore();
    }
}