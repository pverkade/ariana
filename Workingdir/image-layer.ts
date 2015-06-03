/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>

class ImageLayer extends Layer {
    static program = null;
    layerType : LayerType = LayerType.ImageLayer;

	texture : WebGLTexture;

    internalScaleMatrix : Float32Array;
	
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

        this.internalScaleMatrix = mat3.create();
        mat3.identity(this.internalScaleMatrix);

        var scaleX : number, scaleY : number;

        if (image.width > image.height) {
            scaleX = 1;
            scaleY = image.height / image.width;
        }
        else {
            scaleX = image.width / image.height;
            scaleY = 1;
        }

        var internalScaleFactors = new Float32Array([scaleX, scaleY]);
        mat3.scale(this.internalScaleMatrix, this.internalScaleMatrix, internalScaleFactors);
	}
	
	setupRender() {
		ImageLayer.program.activate();
	}
	
	render(depthFrac : number) {
		var matrix : Float32Array = mat3.create();
		mat3.identity(matrix);
		mat3.multiply(matrix, matrix, this.translationMatrix);
		mat3.multiply(matrix, matrix, this.rotationMatrix);
		mat3.multiply(matrix, matrix, this.scaleMatrix);
        mat3.multiply(matrix, matrix, this.internalScaleMatrix);

		ImageLayer.program.setUniforms(this.texture, matrix, this.depth / depthFrac);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	
	copyFramebuffer(width : number, height : number) {
		//TODO: Zet rotatie en andere shit op default SHIT VLADIM HOUDT VAN SHIT

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, width, height, 0);
	}
}