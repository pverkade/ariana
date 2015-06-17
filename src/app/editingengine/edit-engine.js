/// <reference path="../renderengine/layer"/>
/// <reference path="../renderengine/selection-layer"/>
/// <reference path="../renderengine/magic-selection"/>
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
    EditEngine.prototype.setSelectionLayer = function (magicSelection, selectionLayer) {
        console.log("Edit engine setSelecitonLayer");
        this.selectionLayer = selectionLayer;
        var imageData = this.context.createImageData(selectionLayer.getWidth(), selectionLayer.getHeight());
        var offset = 0;
        var thisPtr = this;
        this.selectionTmpCanvas = document.createElement("canvas");
        this.selectionTmpCanvas.width = imageData.width;
        this.selectionTmpCanvas.height = imageData.height;
        this.selectionTmpContext = this.selectionTmpCanvas.getContext("2d");
        this.selectionAntsInterval = setInterval(function () {
            var tmpContext = thisPtr.selectionTmpContext;
            var layer = thisPtr.selectionLayer;
            magicSelection.marchingAnts(imageData, 5.0, offset);
            offset += 0.1;
            tmpContext.clearRect(0, 0, selectionLayer.getWidth(), selectionLayer.getHeight());
            tmpContext.putImageData(imageData, 0, 0);
            thisPtr.clear();
            thisPtr.context.save();
            thisPtr.context.rotate(layer.getRotation());
            thisPtr.context.translate(layer.getPosX() - layer.getWidth() / 2.0, layer.getPosY() - layer.getHeight() / 2.0);
            thisPtr.context.drawImage(this.selectionTmpCanvas, 0, 0);
            thisPtr.context.restore();
        }, 1000);
    };
    EditEngine.prototype.removeSelectionLayer = function () {
        this.selectionLayer = null;
        if (this.selectionAntsInterval) {
            clearInterval(this.selectionAntsInterval);
        }
    };
    return EditEngine;
})();
//# sourceMappingURL=edit-engine.js.map