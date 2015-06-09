/// <reference path="image-shader-program"/>
/// <reference path="brightness-filter"/>

class ResourceManager {
    private gl : WebGLRenderingContext;
    private imageShaderProgram : ImageShaderProgram;
    private brightnessProgram : BrightnessProgram;

    constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
    }

    getWebGLContext() : WebGLRenderingContext {
        return this.gl;
    }

    imageShaderProgramInstance() : ImageShaderProgram {
        if (!this.imageShaderProgram) {
            this.imageShaderProgram = new ImageShaderProgram(this.gl);
        }
        return this.imageShaderProgram;
    }

    brightnessProgramInstance() : BrightnessProgram {
        if (!this.brightnessProgram) {
            this.brightnessProgram = new BrightnessProgram(this.gl);
        }
        return this.brightnessProgram;
    }
}