/// <reference path="../renderengine/layer"/>
/// <reference path="../renderengine/image-layer"/>
/// <reference path="../renderengine/abstract-selection"/>
/// <reference path="../renderengine/magic-selection"/>

enum EditMode {
    translate,
    rotate,
    scale
}

class EditEngine {
    littleSquareDiameter = 4;
    rotateImage : HTMLImageElement;
    width : number;
    height : number;
    context : CanvasRenderingContext2D;

    /* Scale/rotate/translate stuff */
    currentLayer : Layer;
    currentMode : EditMode;

    /* (Magic) selection stuff */
    selectionLayer : ImageLayer;
    selectionAntsInterval;
    selectionTmpCanvas;
    selectionTmpContext;

    constructor(canvas : HTMLCanvasElement) {
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.rotateImage = new Image();
        this.rotateImage.src = "";
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

    private drawTranslateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var dimensions = layer.getTransformedDimensions();
        var width = dimensions[0];
        var height = dimensions[1];
        var rotation = layer.getRotation();

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

    private drawRotateTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var rotation = layer.getRotation();
        
        this.clear();

        context.save();
        this.setColors(context);
        context.translate(x, y);
        context.fillRect(
            -this.littleSquareDiameter * 0.5,
            -this.littleSquareDiameter * 0.5,
            this.littleSquareDiameter,
            this.littleSquareDiameter
        );
        context.restore();
    }

    private drawScaleTool(layer : Layer) {
        var context = this.context;
        var x = layer.getPosX();
        var y = layer.getPosY();
        var dimensions = layer.getTransformedDimensions();
        var width = dimensions[0];
        var height = dimensions[1];
        var rotation = layer.getRotation();

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

    public getEditMode() : EditMode {
        return this.currentMode;
    }

    public setEditLayer(layer : Layer, mode : EditMode) {
        this.currentLayer = layer;
        this.currentMode = mode;
    }

    public removeEditLayer() {
        this.currentLayer = null;
    }

    public setSelectionLayer(marchingAnts : MarchingAnts, selectionLayer : ImageLayer) : void {
        this.selectionLayer = selectionLayer;

        var imageData = this.context.createImageData(selectionLayer.getImage().width, selectionLayer.getImage().height);
        var offset = 0;
        var thisPtr = this;
        this.selectionTmpCanvas = document.createElement("canvas");
        this.selectionTmpCanvas.width = imageData.width;
        this.selectionTmpCanvas.height = imageData.height;
        this.selectionTmpContext = this.selectionTmpCanvas.getContext("2d");

        this.selectionAntsInterval = setInterval(function() {
            var tmpContext = thisPtr.selectionTmpContext;
            marchingAnts.writeData(imageData, 5.0, ++offset);
            tmpContext.clearRect(0, 0, selectionLayer.getWidth(), selectionLayer.getHeight());
            tmpContext.putImageData(imageData, 0, 0);
        }, 500);
    }

    public removeSelectionLayer() : void {
        this.selectionLayer = null;
        if (this.selectionAntsInterval) {
            clearInterval(this.selectionAntsInterval);
        }
    }

    public render() : void {
        this.clear();
        var currentLayer : Layer = this.currentLayer;
        if (currentLayer) {
            switch (this.currentMode) {
                case EditMode.rotate:
                    this.drawRotateTool(currentLayer);
                    break;
                case EditMode.translate:
                    this.drawTranslateTool(currentLayer);
                    break;
                case EditMode.scale:
                    this.drawScaleTool(currentLayer);
                    break;
            }
        }

        /* Draw marching ants */
        var selectionLayer : ImageLayer = this.selectionLayer;
        if (selectionLayer) {
            this.context.save();
            
            var transformation = this.selectionLayer.calculateTransformation();
            
            this.context.transform(transformation[0], transformation[3], transformation[1], transformation[4], transformation[6], -transformation[7]);
            
            this.context.drawImage(
                this.selectionTmpCanvas,
                -1,
                -1,
                2,
                2);
            this.context.restore();
        }
    }

    needsAnimating() : boolean {
        return (this.selectionLayer!=null);
    }
}