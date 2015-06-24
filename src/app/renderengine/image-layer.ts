/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>
/// <reference path="image-shader-program"/>
/// <reference path="resource-manager"/>
/// <reference path="filters/filter"/>

class ImageLayer extends Layer {
    protected program : ImageShaderProgram;
    protected layerType : LayerType = LayerType.ImageLayer;

    private image : HTMLImageElement;
    private filter : Filter;
	private texture : WebGLTexture;

    private originalHeight : number;
    private originalWidth : number;

    private drawbuffer : DrawBuffer;

	constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        image : HTMLImageElement) {
        super(resourceManager, canvasWidth, canvasHeight, image ? image.width : 0, image ? image.height : 0);

        this.program = resourceManager.imageShaderProgramInstance();

        /* Store the dimensions of the image that is uploaded to the GPU */
        if (image) {
            this.originalWidth = image.width;
            this.originalHeight = image.height;
        }

        var gl = this.gl;

        /* Copy the image to the GPU */
        this.image = image;
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		/* Set up texture so we can render any size image and so we are working with pixels */
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}

    /* Setup gl variables for rendering this type of layer */
	setupRender() {
		this.program.activate();
	}

    /* Render an arbitrary WebGLTexture with the properties of this layer */
	private renderTexture(texture : WebGLTexture) {
        var matrix : Float32Array = this.calculateTransformation();
        mat3.multiply(matrix, this.pixelConversionMatrix, matrix);

        var flipMatrix = mat3.create();
        mat3.scale(
            flipMatrix,
            flipMatrix,
            new Float32Array([
                this.flipX ? -1.0 : 1.0,
                this.flipY ? -1.0 : 1.0
            ])
        );
        mat3.translate(
            flipMatrix,
            flipMatrix,
            new Float32Array([
                this.flipX ? -1.0 : 0.0,
                this.flipY ? -1.0 : 0.0
            ])
        );

        this.program.setUniforms(texture, matrix, flipMatrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    /* Render the current layer with a filter */
    private renderWithFilter(filter : Filter) {

        var oldViewport = this.gl.getParameter(this.gl.VIEWPORT);
        var oldFramebuffer : WebGLFramebuffer = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);

        /* Resize the viewport to the original size of the image (that is stored in GPU memory) */
        this.gl.viewport(0, 0, this.originalWidth, this.originalHeight);

        /* Draw the image with the filter applied to an offscreen drawbuffer */
        this.drawbuffer.bind();
        {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
            filter.render(this.resourceManager, this.texture);
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, oldFramebuffer);
        this.gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);

        /* Render this layer with the filtered image instead of the original image */
        this.setupRender();
        this.renderTexture(this.drawbuffer.getWebGlTexture());
    }

    public render() {
        if (this.filter) {
            this.renderWithFilter(this.filter);
        }
        else {
            this.renderTexture(this.texture);
        }
    }

    /* Render this image completely filling the bound framebuffer */
    renderFullscreen() {
        var matrix = mat3.create();
        var flipMatrix = mat3.create();

        this.program.setUniforms(this.texture, matrix, flipMatrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    /* Replace the current image with the currently bound framebuffer */
	copyFramebuffer(width : number, height : number) {
        var data = new Uint8Array(width * height * 4);
        this.gl.readPixels(0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

        /* Flip the image's Y axis to match the WebGL texture coordinate space */
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);

        /* Update the thumbnail */
        this.notifyPropertyChanged();
	}

    getImage() : HTMLImageElement {
        return this.image;
    }

    destroy() {
        super.destroy();
        this.gl.deleteTexture(this.texture);
    }

    public getWebGlTexture() : WebGLTexture {
        return this.texture
    }

    /*
     * Set a filter that is used when render is called
     * This filter is not appled until commitFilter() is called, meaning that you can remove
     *  the filter or change its paramters
     */
    public applyFilter(filter : Filter) : void {
        this.filter = filter;

        /* Make a drawbuffer if there is no drawbuffer, or the original dimensions have changed. */
        if (!this.drawbuffer ||
            !(this.originalWidth === this.drawbuffer.getWidth()
                && this.originalHeight === this.drawbuffer.getHeight())) {
            this.drawbuffer = new DrawBuffer(this.gl, this.originalWidth, this.originalHeight);
        }
    }

    /* Stop rendering with a filter */
    public discardFilter() : void {
        this.filter = null;
        if (this.drawbuffer) {
            this.drawbuffer.destroy();
            this.drawbuffer = null;
        }
    }

    /* Apply the current filter to the image in GPU memory making the filter permanent */
    public commitFilter() : void {
        if (!this.filter) {
            return;
        }

        /* Store the width and height of the current framebuffer */
        var oldWidth : number = this.gl.drawingBufferWidth;
        var oldHeight : number = this.gl.drawingBufferHeight;

        /* Resize the viewport to the original size of the image (that is stored in GPU memory) */
        var layerWidth = this.originalWidth;
        var layerHeight = this.originalHeight;
        this.gl.viewport(0, 0, layerWidth, layerHeight);

        /* Draw the image with the filter applied to an offscreen drawbuffer */
        this.drawbuffer.bind();
        {
            /* Render the image with its filter and then replace the image with the result */
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
            this.filter.render(this.resourceManager, this.texture);

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, layerWidth, layerHeight, 0);
        }

        /* Switch back to the onscreen drawbuffer and restore the viewport */
        this.drawbuffer.unbind();
        this.gl.viewport(0, 0, oldWidth, oldHeight);

        /* Stop applying the filter (we already changed the image in GPU memory) */
        this.discardFilter();

        /* Update thumbnail */
        this.notifyPropertyChanged();
    }
}