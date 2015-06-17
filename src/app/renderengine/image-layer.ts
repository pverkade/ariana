/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>
/// <reference path="resource-manager"/>

class ImageLayer extends Layer {
    protected program : ImageShaderProgram;
    protected layerType : LayerType = LayerType.ImageLayer;

    private image : HTMLImageElement;
	private texture : WebGLTexture;

	constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        image : HTMLImageElement) {
        super(resourceManager, canvasWidth, canvasHeight, image ? image.width : 0, image ? image.width : 0);

        this.program = resourceManager.imageShaderProgramInstance();

        var gl = this.gl;

        this.image = image;
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
		this.program.activate();
	}

    renderFullscreen() {
        var matrix = mat3.create();
        this.program.setUniforms(this.texture, matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

	render() {
        var matrix : Float32Array = mat3.create();
        mat3.identity(matrix);
        mat3.multiply(matrix, matrix, this.pixelConversionMatrix);
        mat3.multiply(matrix, matrix, this.translationMatrix);
        mat3.multiply(matrix, matrix, this.rotationMatrix);
        mat3.multiply(matrix, matrix, this.sizeMatrix);
        this.program.setUniforms(this.texture, matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

	copyFramebuffer(width : number, height : number) {
        // This way is more efficient (no copying to javascript and back) but it doesnt support flip Y
        //this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        //this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, width, height, 0);

        var data = new Uint8Array(width * height * 4);
        this.gl.readPixels(0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

        // Flip the image's Y axis to match the WebGL texture coordinate space
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);

        // SetDimensions already triggers notifyPropertyChanged
        //this.setDimensions(width, height);
        this.notifyPropertyChanged();
	}

    getImage() : HTMLImageElement {
        return this.image;
    }

    getWebGLTexture() : WebGLTexture {
        return this.texture;
    }

    destroy() {
        super.destroy();
        this.gl.deleteTexture(this.texture);
    }
}