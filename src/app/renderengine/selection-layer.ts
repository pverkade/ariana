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

        this.sizeMatrix = this.selectedLayer.sizeMatrix;
        this.rotationMatrix = this.selectedLayer.rotationMatrix;
        this.translationMatrix = this.selectedLayer.translationMatrix;
        this.posX = this.selectedLayer.getPosX();
        this.posY = this.selectedLayer.getPosY();
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