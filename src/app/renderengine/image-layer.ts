/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>

class ImageLayer extends Layer {
    protected static program = null;
    protected layerType : LayerType = LayerType.ImageLayer;

	private texture : WebGLTexture;

	constructor(
        gl : WebGLRenderingContext,
        canvasWidth : number,
        canvasHeight : number,
        image : ImageData) {
        super(gl, canvasWidth, canvasHeight, image.width, image.height);

        if (ImageLayer.program == null) {
            ImageLayer.program = new ImageShaderProgram(gl);
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
        mat3.multiply(matrix, matrix, this.pixelConversionMatrix);
		mat3.multiply(matrix, matrix, this.translationMatrix);
		mat3.multiply(matrix, matrix, this.rotationMatrix);
        mat3.multiply(matrix, matrix, this.sizeMatrix);
		ImageLayer.program.setUniforms(this.texture, matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	}

	copyFramebuffer(width : number, height : number) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, width, height, 0);

        this.setDimensions(width, height);
	}

    destroy() {
        super.destroy();
        this.gl.deleteTexture(this.texture);
    }
}