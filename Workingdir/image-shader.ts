/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="shader"/>

class ImageShader implements Shader
{
    program : WebGLProgram;

    matrixLocation : WebGLUniformLocation;
    samplerLocation : WebGLUniformLocation;

    constructor() {
        var vertexShader = compileShaderFromScript("image-shader-vs");
        var fragmentShader = compileShaderFromScript("image-shader-fs");

        this.program = compileProgram(vertexShader, fragmentShader);

        var positionLocation = gl.getAttribLocation(this.program, "a_position");
        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");

        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);


    }

    activate() : void {
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.samplerLocation, 0);
    }

    setStuff(texture : WebGLTexture, matrix : Float32Array) : void {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniformMatrix3fv(this.matrixLocation, false, matrix);
    }
}