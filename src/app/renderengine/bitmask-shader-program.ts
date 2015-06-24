/*
 * A shader program for drawing a "bitmask"
 * It is used for cutting out a selections
 */

/// <reference path="render-helper"/>
/// <reference path="shader-program"/>
/// <reference path="base-program"/>
class BitmaskShaderProgram extends BaseProgram {
    program : WebGLProgram;

    samplerLocation : WebGLUniformLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "bitmask.frag");
        super(gl);

        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_bitmask");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.samplerLocation, 0);
    }

    setUniforms(texture : WebGLTexture) : void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }
}