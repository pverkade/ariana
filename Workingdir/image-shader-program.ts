/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="shader-program"/>
/// <reference path="base-program"/>

class ImageShaderProgram extends BaseProgram implements ShaderProgram {
    program : WebGLProgram;

    samplerLocation : WebGLUniformLocation;
    depthLocation : WebGLUniformLocation;
    matrixLocation : WebGLUniformLocation;

    vertexSource : string = "image-shader-vs";
    fragmentSource: string = "image-shader-fs";

    constructor() {
        super();
        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");
        this.depthLocation = gl.getUniformLocation(this.program, "u_depth");
        this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.samplerLocation, 0);
    }

    setUniforms(texture : WebGLTexture, matrix : Float32Array, depth : number) : void {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1f(this.depthLocation, depth);
        gl.uniformMatrix3fv(this.matrixLocation, matrix);
    }
}