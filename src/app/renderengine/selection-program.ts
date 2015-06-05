/**
 * Created by zeta on 6/4/15.
 */
/// <reference path="base-program"/>

class SelectionProgram extends BaseProgram {
    program : WebGLRenderingContext;

    bitmapLocation : WebGLUniformLocation;
    samplerLocation : WebGLTexture;

    bitmask : WebGLTexture;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter-vs", "selection-fs");
        super(gl);

        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.bitmapLocation = this.gl.getUniformLocation(this.program, "u_bitmap");
        this.samplerLocation = this.gl.getUniformLocation(this.program, "u_sampler");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    setBitmask(bitmap : Uint8Array, width: number, height: number) : void {
        if (!this.bitmask) {
            this.gl.deleteTexture(this.bitmask);
        }

        this.bitmask = this.gl.createTexture();

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bitmask);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        (<any>this.gl).texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, width, height, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE, bitmap);
    }

    setupRender(texture : WebGLTexture) {
        super.activate();
        this.gl.uniform1i(this.samplerLocation, 0);
        this.gl.uniform1i(this.bitmapLocation, 1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bitmask);
    }
}
