/*
 * Shader program for square geometry
 * This class is currently used as abstract class, it contains code that is necessary in all of its children
 */
/// <reference path="render-helper"/>
/// <reference path="shader-program"/>

class BaseProgram implements ShaderProgram {
    protected gl : WebGLRenderingContext;
    protected program : WebGLProgram;

    protected vertexBuffer : WebGLBuffer;

    protected vertexSource : string;
    protected fragmentSource: string;

    constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
        var vertexShader = compileShaderFromScript(gl, this.vertexSource);
        var fragmentShader = compileShaderFromScript(gl, this.fragmentSource);

        this.program = compileProgram(gl, vertexShader, fragmentShader);

        /*
         * Create an array of vertex data on the GPU
         * Every vertex contains 4 floats:
         *  2 floats for the vertex position
         *  2 floats for the texture position
         */
        var positionLocation = this.gl.getAttribLocation(this.program, "a_position");

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                -1.0, -1.0,
                0.0,  1.0,
                1.0, -1.0,
                1.0,  1.0,
                -1.0,  1.0,
                0.0,  0.0,
                1.0,  1.0,
                1.0,  0.0]),
            this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
    }

    setShaderSource(vertexSource, fragmentSource) {
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
    }

    activate() : void {
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    }
}