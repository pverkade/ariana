/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="shader-program"/>
/// <reference path="base-program"/>

class ImageShaderProgram extends BaseProgram {
    program : WebGLProgram;

    samplerLocation : WebGLUniformLocation;
    matrixLocation : WebGLUniformLocation;

    constructor() {
        super.setShaderSource("image-shader-vs", "image-shader-fs");
        super();

        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.samplerLocation, 0);
    }

    setUniforms(texture : WebGLTexture, matrix : Float32Array) : void {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniformMatrix3fv(this.matrixLocation, false, matrix);
    }
}