/// <reference path="gl-matrix"/>
enum LayerType {ImageLayer};

class Layer {
    protected gl : WebGLRenderingContext;
	protected static MaxID = 0;
	protected layerType : number;
	private ID : LayerType;
	protected angle : number;
	protected scaleX : number;
	protected scaleY : number;
	protected posX : number;
	protected posY : number;

	protected scaleMatrix : Float32Array;
	protected rotationMatrix : Float32Array;
	protected translationMatrix : Float32Array;
    protected aspectRatioMatrix : Float32Array;

	constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
		this.ID = Layer.MaxID++;

		this.scaleMatrix = mat3.create();
		this.rotationMatrix = mat3.create();
		this.translationMatrix = mat3.create();
        this.aspectRatioMatrix = mat3.create();

        /* Apperently calling a function on this object from within the constructor crashes it */
        this.posX = 0;
        this.posY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;

        mat3.identity(this.scaleMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
	}

	setDefaults() {
        this.posX = 0;
        this.posY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;

        mat3.identity(this.scaleMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
	}

	setRotation(angle : number) {
		this.angle = angle;
		mat3.identity(this.rotationMatrix);
		mat3.rotate(this.rotationMatrix, this.rotationMatrix, angle);
	}
	
	getRotation() : number {
		return this.angle;
	}
	
	setScale(scaleX : number, scaleY : number) {
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		
		mat3.identity(this.scaleMatrix);
		mat3.scale(this.scaleMatrix, this.scaleMatrix, new Float32Array([scaleX, scaleY]));
	}
	
	getScaleX() : number {
		return this.scaleX;
	}
	
	getScaleY() : number {
		return this.scaleY;
	}
	
	setPos(x : number, y : number) {
		this.posX = x;
		this.posY = y;
		
		this.translationMatrix = mat3.identity(this.translationMatrix);
		mat3.translate(this.translationMatrix, this.translationMatrix, new Float32Array([x, y]));
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
	render(aspectRatio) {
        mat3.identity(this.aspectRatioMatrix);
        mat3.scale(this.aspectRatioMatrix, this.aspectRatioMatrix, new Float32Array([1, aspectRatio]));
    }

    destroy() {
        delete this.rotationMatrix;
        delete this.scaleMatrix;
        delete this.translationMatrix;
        delete this.aspectRatioMatrix;
    }
}