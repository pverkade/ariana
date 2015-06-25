/*
 * Project Ariana
 * texture-program.ts
 *
 * This file contains a program to draw a full screen texture in the viewport.
 *
 */

/// <reference path="base-program"/>

class TextureProgram extends BaseProgram {
    protected program : WebGLRenderingContext;
    protected samplerLocation : WebGLUniformLocation;

    constructor(gl : WebGLRenderingContext) {
        this.setShaderSource("identity.vert", "image.frag");
        super(gl);

        var texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = this.gl.getUniformLocation(this.program, "u_sampler");

        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
    }

    /* This function sets the correct program and binds the correct texture unit.
     */
    activate() : void {
        super.activate();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.samplerLocation, 0);
    }

    /* This program binds the texture.
     */
    bindTexture(texture : WebGLTexture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    /* This function renders the given texture in fullscreen to the viewport.
     *
     * For convenience this function also activates the program.
     */
    render(texture : WebGLTexture) : void{
        this.activate();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}