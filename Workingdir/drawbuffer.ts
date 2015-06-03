/**
 * Created by zeta on 6/1/15.
 */
/// <reference path="render-helper" />

class DrawBuffer {
    texture : WebGLTexture;
    framebuffer : WebGLFramebuffer;
    renderbuffer : WebGLRenderbuffer;
    width : number;
    height : number;

    constructor(width : number, height : number) {
        this.width = width;
        this.height = height;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    getImage() {
        /* Read the contents of the framebuffer */
        var data = new Uint8Array(this.width * this.height * 4);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);

        /* Create a 2D canvas to store the result */
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext('2d');

        /* Copy the pixels to a 2D canvas */
        var imageData = context.createImageData(this.width, this.height);
        imageData.data.set(data);
        context.putImageData(imageData, 0, 0);

        return canvas.toDataURL();
    }

    bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }

    unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }
}