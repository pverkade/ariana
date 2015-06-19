/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>
/// <reference path="resource-manager"/>
/// <reference path="filters/filter"/>

class ImageLayer extends Layer {
    protected program : ImageShaderProgram;
    protected layerType : LayerType = LayerType.ImageLayer;

    private filter : Filter;
	private texture : WebGLTexture;

	constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        image : ImageData) {
        super(resourceManager, canvasWidth, canvasHeight, image ? image.width : 0, image ? image.height : 0);

        this.program = resourceManager.imageShaderProgramInstance();

        var gl = this.gl;

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

    private renderWithoutFilter() {
        var matrix : Float32Array = this.calculateTransformation();
        mat3.multiply(matrix, this.pixelConversionMatrix, matrix);

        this.program.setUniforms(this.texture, matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

	render() {
        console.log("image-layer render");


        if (!this.filter) {
            this.renderWithoutFilter();
            return;
        }
        var drawbuffer1 : DrawBuffer = this.resourceManager.getDrawbuffer1();
        var drawbuffer2 : DrawBuffer = this.resourceManager.getDrawbuffer2();
        var textureProgram : TextureProgram = this.resourceManager.textureProgramInstance();

        drawbuffer1.bind();
        {
            this.renderWithoutFilter();
        }
        drawbuffer1.unbind();

        drawbuffer2.bind();
        {
            textureProgram.render(drawbuffer1.getWebGlTexture());
        }
        drawbuffer2.unbind();

        if (this.filter) {
            this.filter.render(this.resourceManager, drawbuffer2.getWebGlTexture());
        }
	}

	copyFramebuffer(width : number, height : number) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, width, height, 0);

        /* SetDimensions already triggers notifyPropertyChanged */
        this.setDimensions(width, height);
	}

    destroy() {
        super.destroy();
        this.gl.deleteTexture(this.texture);
    }

    public getWebGlTexture() : WebGLTexture {
        return this.texture
    }

    public applyFilter(filter : Filter) {
        this.filter = filter;
    }

    public discardFilter() {
        this.filter = null;
    }

    public commitFilter() {
        if (!this.filter) {
            return;
        }
        var drawbuffer1 : DrawBuffer = this.resourceManager.getDrawbuffer1();
        var textureProgram : TextureProgram = this.resourceManager.textureProgramInstance();

        drawbuffer1.bind();
        {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.filter.render(this.resourceManager, this.texture);

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, this.width, this.height, 0);

            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            textureProgram.render(this.texture);

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, this.width, this.height, 0);
        }
        drawbuffer1.unbind();
        this.filter = null;
    }
}