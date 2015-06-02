/// <reference path="gl-matrix"/>

class Layer {
	static MaxID = 0;
	layerType : number;
	ID : number;
	angle : number;
	scaleX : number;
	scaleY : number;
	posX : number;
	posY : number;
	depth : number;
	
	scaleMatrix : Float32Array;
	rotationMatrix : Float32Array;
	translationMatrix : Float32Array;
	
	constructor() {
		this.ID = Layer.MaxID++;
		
		this.scaleMatrix = mat3.create();
		this.rotationMatrix = mat3.create();
		this.translationMatrix = mat3.create();
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
	
	setDepth(depth : number) {
		this.depth = depth;
	}
	
	getDepth() : number {
		return this.depth;
	}
	
	getID() : number {
		return this.ID;
	}
	
	setupRender() { }
	render() { }
}