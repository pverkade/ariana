/* A shader program for drawing an image layer */

/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="shader-program"/>
/// <reference path="base-program"/>

class ImageShaderProgram extends BaseProgram {
    program : WebGLProgram;

    samplerLocation : WebGLUniformLocation;
    matrixLocation : WebGLUniformLocation;
    flipMatrixLocation : WebGLUniformLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("image.vert", "image.frag");
        super(gl);

        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
        this.flipMatrixLocation = gl.getUniformLocation(this.program, "u_flipMatrix");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.samplerLocation, 0);
    }

    setUniforms(texture : WebGLTexture, matrix : Float32Array, flipMatrix : Float32Array) : void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix);
        this.gl.uniformMatrix3fv(this.flipMatrixLocation, false, flipMatrix);
    }
}