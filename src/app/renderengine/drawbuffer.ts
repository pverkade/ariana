/**
 * Created by zeta on 6/1/15.
 */
/// <reference path="render-helper" />

class DrawBuffer {
    private gl : WebGLRenderingContext;
    private texture : WebGLTexture;
    private framebuffer : WebGLFramebuffer;
    private renderbuffer : WebGLRenderbuffer;
    private width : number;
    private height : number;

    constructor(gl : WebGLRenderingContext, width : number, height : number) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // typescript doens't have signature for this function.
        // is a bug of typescript 1.5 beta.
        (<any>gl).texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        this.renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);

        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.renderbuffer);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    }

    getImage() {
        /* Read the contents of the framebuffer */
        var data = this.getData();

        /* Create a 2D canvas to store the result */
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var context : any = canvas.getContext('2d');

        /* Copy the pixels to a 2D canvas */
        var imageData = context.createImageData(this.width, this.height);
        (<any>(imageData.data)).set(data);
        context.putImageData(imageData, 0, 0);

        return canvas.toDataURL();
    }

    getData() : Uint8Array {
        var data = new Uint8Array(this.width * this.height * 4);
        this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        return data;
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    }

    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    getWebGlTexture() : WebGLTexture {
        return this.texture;
    }

    resize(width : number, height : number) {
        this.width = width;
        this.height = height;

        // Resize texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        (<any>this.gl).texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        // Resize render buffer
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    }

    destroy() {
        this.gl.deleteTexture(this.texture);
        this.gl.deleteRenderbuffer(this.renderbuffer);
        this.gl.deleteFramebuffer(this.framebuffer);
    }
}