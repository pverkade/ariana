/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>

class ImageLayer extends Layer {
    static program = null;
    layerType : number = 0;

	matrixLocation : WebGLUniformLocation;
    samplerLocation : WebGLUniformLocation;
	
	vertexBuffer : WebGLBuffer;
	texture : WebGLTexture;
	
	constructor(image : HTMLImageElement) {
		super();

        if (ImageLayer.program == null) {
            ImageLayer.program = new ImageShaderProgram();
        }
	
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	 
		// Set up texture so we can render any size image and so we are
		// working with pixels.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}
	
	setupRender() {
		ImageLayer.program.activate();
	}
	
	render() {
		var matrix : Float32Array = mat3.create();
		mat3.identity(matrix);
		mat3.multiply(matrix, matrix, this.translationMatrix);
		mat3.multiply(matrix, matrix, this.rotationMatrix);
		mat3.multiply(matrix, matrix, this.scaleMatrix);

		ImageLayer.program.setStuff(this.texture, matrix, this.depth);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}