/// <reference path="gl-matrix"/>
/// <reference path="resource-manager"/>
enum LayerType {ImageLayer};

class Layer {
    protected gl;
    protected resourceManager : ResourceManager;
	protected static MaxID = 0;
	protected layerType : number;
	private ID : LayerType;
	protected angle : number;
    protected width : number;
    protected height : number;
	protected posX : number;
	protected posY : number;

	protected sizeMatrix : Float32Array;
	protected rotationMatrix : Float32Array;
	protected translationMatrix : Float32Array;
    protected pixelConversionMatrix : Float32Array;

	constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        width : number,
        height : number) {
        this.gl = resourceManager.getWebGLContext();
        this.resourceManager = resourceManager;
		this.ID = Layer.MaxID++;

		this.sizeMatrix = mat3.create();
		this.rotationMatrix = mat3.create();
		this.translationMatrix = mat3.create();
        this.pixelConversionMatrix = mat3.create();

        /* Apperently calling a function on this object from within the constructor crashes it */
        this.posX = 0.0;
        this.posY = 0.0;
        this.width = 1.0;
        this.height = 1.0;
        this.angle = 0.0;

        mat3.identity(this.sizeMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
        mat3.identity(this.pixelConversionMatrix);

        mat3.translate(
            this.pixelConversionMatrix,
            this.pixelConversionMatrix,
            new Float32Array([-1.0, 1.0])
        );
        mat3.scale(
            this.pixelConversionMatrix,
            this.pixelConversionMatrix,
            new Float32Array([2.0/canvasWidth, 2.0/canvasHeight])
        );

        mat3.scale(
            this.sizeMatrix,
            this.sizeMatrix,
            new Float32Array([width/2.0, height/2.0])
        );
	}

	setRotation(angle : number) {
		this.angle = angle;
		mat3.identity(this.rotationMatrix);
		mat3.rotate(this.rotationMatrix, this.rotationMatrix, angle);
	}

	getRotation() : number {
		return this.angle;
	}

	setWidth(width : number) {
		this.setDimensions(width, this.height);
	}

	setHeight(height : number) {
        this.setDimensions(this.width, height);
	}

	setDimensions(width : number, height : number) {
        this.width = width;
        this.height = height;

		mat3.identity(this.sizeMatrix);
        mat3.scale(
            this.sizeMatrix,
            this.sizeMatrix,
            new Float32Array([width/2.0, height/2.0])
        );
	}

	setPos(x : number, y : number) {
		this.posX = x;
		this.posY = y;

		mat3.identity(this.translationMatrix);
		mat3.translate(this.translationMatrix, this.translationMatrix, new Float32Array([x, -y]));
	}

	getPosX() : number {
		return this.posX;
	}

	getPosY() : number {
		return this.posY;
	}

	getID() : number {
		return this.ID;
	}

    getLayerType() : LayerType {
        return this.layerType;
    }

	setupRender() { }
	render() { }

    destroy() {
        delete this.rotationMatrix;
        delete this.sizeMatrix;
        delete this.translationMatrix;
        delete this.pixelConversionMatrix;
    }
}