/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="shader-program"/>

class ImageShaderProgram implements ShaderProgram
{
    program : WebGLProgram;

    matrixLocation : WebGLUniformLocation;
    samplerLocation : WebGLUniformLocation;
    vertexBuffer : WebGLBuffer;

    constructor() {
        var vertexShader = compileShaderFromScript("image-shader-vs");
        var fragmentShader = compileShaderFromScript("image-shader-fs");

        this.program = compileProgram(vertexShader, fragmentShader);

        var positionLocation = gl.getAttribLocation(this.program, "a_position");
        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1.0, -1.0,
                0.0,  1.0,
                1.0, -1.0,
                1.0,  1.0,
                -1.0,  1.0,
                0.0,  0.0,
                1.0,  1.0,
                1.0,  0.0]),
            gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.samplerLocation, 0);
    }

    setStuff(texture : WebGLTexture, matrix : Float32Array) : void {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniformMatrix3fv(this.matrixLocation, false, matrix);
    }
}