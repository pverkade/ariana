/* A shader program for drawing an image layer */

/// <reference path="render-helper"/>
/// <reference path="shader-program"/>
/// <reference path="base-program"/>

class BackgroundShaderProgram extends BaseProgram {
    program : WebGLProgram;

    widthLocation : WebGLUniformLocation;
    heightLocation : WebGLUniformLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("identity.vert", "background.frag");
        super(gl);

        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");

        this.widthLocation = gl.getUniformLocation(this.program, "u_width");
        this.heightLocation = gl.getUniformLocation(this.program, "u_height");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
    }

    setUniforms(width : number, height : number) : void {
        this.gl.uniform1f(this.widthLocation, width);
        this.gl.uniform1f(this.heightLocation, height);
    }
}