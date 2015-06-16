/// <reference path="../renderengine/layer"/>
var EditEngine = (function () {
    function EditEngine(canvas) {
        this.littleSquareDiameter = 4;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.rotateImage = new Image();
        this.rotateImage.src = "/assets/vectors/rotate-left.svg";
    }
    EditEngine.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    EditEngine.prototype.setColors = function (context) {
        context.lineWidth = 1;
        context.fillStyle = "#000000";
        context.strokeStyle = "#000000";
    };
    EditEngine.prototype.drawTranslateTool = function (layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();
        this.clear();
        context.save();
        this.setColors(context);
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width / 2.0, -height / 2.0, width, height);
        context.fillRect(-this.littleSquareDiameter / 2.0, -this.littleSquareDiameter / 2.0, this.littleSquareDiameter, this.littleSquareDiameter);
        context.restore();
    };
    EditEngine.prototype.drawRotateTool = function (layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();
        this.clear();
        context.save();
        this.setColors(context);
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width / 2.0, -height / 2.0, width, height);
        context.fillRect(-this.littleSquareDiameter / 2.0, -this.littleSquareDiameter / 2.0, this.littleSquareDiameter, this.littleSquareDiameter);
        context.drawImage(this.rotateImage, this.rotateImage.width / -2.0, height / -2.0 - 30);
        context.restore();
    };
    EditEngine.prototype.drawScaleTool = function (layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var width = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();
        this.clear();
        context.save();
        this.setColors(context);
        context.translate(x, y);
        context.rotate(-rotation);
        context.strokeRect(-width / 2.0, -height / 2.0, width, height);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                context.fillRect(-width / 2.0 * i - this.littleSquareDiameter / 2.0, -height / 2.0 * j - this.littleSquareDiameter / 2.0, this.littleSquareDiameter, this.littleSquareDiameter);
            }
        }
        context.restore();
    };
    return EditEngine;
})();
//# sourceMappingURL=edit-engine.js.map