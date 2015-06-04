/// <reference path="gl-matrix"/>
enum LayerType {ImageLayer};

class Layer {
    gl : WebGLRenderingContext;
	static MaxID = 0;
	layerType : number;
	ID : LayerType;
	angle : number;
	scaleX : number;
	scaleY : number;
	posX : number;
	posY : number;

	scaleMatrix : Float32Array;
	rotationMatrix : Float32Array;
	translationMatrix : Float32Array;


	constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
		this.ID = Layer.MaxID++;

		this.scaleMatrix = mat3.create();
		this.rotationMatrix = mat3.create();
		this.translationMatrix = mat3.create();

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
	
	setupRender() { }
	render() { }

    destroy() {
        delete this.rotationMatrix;
        delete this.scaleMatrix;
        delete this.translationMatrix;
    }
}