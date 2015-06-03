/**
 * Created by zeta on 6/3/15.
 */
/// <reference path="render-helper"/>
/// <reference path="shader-program"/>

class BaseProgram implements ShaderProgram {
    program : WebGLProgram;

    vertexBuffer : WebGLBuffer;

    vertexSource : string;
    fragmentSource: string;

    constructor() {
        var vertexShader = compileShaderFromScript(this.vertexSource);
        var fragmentShader = compileShaderFromScript(this.fragmentSource);

        this.program = compileProgram(vertexShader, fragmentShader);

        var positionLocation = gl.getAttribLocation(this.program, "a_position");

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
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    }

    activate() : void {
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }
}