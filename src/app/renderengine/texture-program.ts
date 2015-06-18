/**
 * Created by zeta on 6/13/15.
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

    activate() : void {
        super.activate();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.samplerLocation, 0);
    }

    bindTexture(texture : WebGLTexture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    render(texture : WebGLTexture) : void{
        this.activate();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}