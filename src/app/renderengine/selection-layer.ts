/// <reference path="image-layer"/>
/// <reference path="layer"/>

class SelectionLayer extends Layer {
    private selectedLayer : ImageLayer;
    private invertedSelectedLayer : ImageLayer;

    constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        selectedLayer : ImageLayer,
        invertedSelectedLayer : ImageLayer) {
        super(
            resourceManager,
            canvasWidth,
            canvasHeight,
            selectedLayer.getWidth(),
            selectedLayer.getHeight()
        );
        this.selectedLayer = selectedLayer;
        this.invertedSelectedLayer = invertedSelectedLayer;
    }

    public setStartPos(x : number, y : number) {
        this.invertedSelectedLayer.setPos(x, y);
        this.setPos(x, y);
    }

    public setStartRotation(angle : number) {
        this.invertedSelectedLayer.setRotation(angle);
        this.setRotation(angle);
    }

    public setStartDimensions(width : number, height : number) {
        this.invertedSelectedLayer.setDimensions(width, height);
        this.setDimensions(width, height);
    }

    public setupRender() {
        this.selectedLayer.setupRender();
    }

    public render() {
        this.selectedLayer.sizeMatrix = this.sizeMatrix;
        this.selectedLayer.rotationMatrix = this.rotationMatrix;
        this.selectedLayer.translationMatrix = this.translationMatrix;

        this.invertedSelectedLayer.render();
        this.selectedLayer.render();
    }
}