/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>

class BrightnessFilter extends ImageShaderProgram implements ShaderProgram {
    brightness: number = 10;

    vertexShader : string = "image-shader-vs";
    fragmentShader : string = "brightness-fs";
    brightnessLocation;

    constructor () {
        super();
        this.brightnessLocation = gl.getUniformLocation(this.program, "u_brightness");
    }

    activate () {
        super.activate();
    }

    setStuff(texture : WebGLTexture, matrix : Float32Array, depth : number) : void {
        super.setStuff(texture, matrix, depth);
        gl.uniform1f(this.brightnessLocation, this.brightness);
    }
}