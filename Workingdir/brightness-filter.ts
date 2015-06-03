/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>
/// <reference path="filter"/>


class BrightnessProgram extends FilterProgram implements ShaderProgram {
    vertexShader : string = "image-shader-vs";
    fragmentShader : string = "brightness-fs";

    brightnessLocation;

    constructor() {
        super();
        this.brightnessLocation = gl.getUniformLocation(this.program, "u_brightness");
    }

    setUniforms(brightness : number) : void {
        gl.uniform1f(this.brightnessLocation, brightness);
    }
}

class BrightnessFilter extends Filter {
    filterType = FilterType.Brightness;
    static program : BrightnessProgram;

    constructor () {
        super();
        this.attributes = {
            'brightness' : 10
        }

        if (!BrightnessFilter.program) {
            BrightnessFilter.program = new BrightnessProgram();
        }
    }

    render (texture : WebGLTexture) {
        BrightnessFilter.program.activate();
        BrightnessFilter.program.bindTexture(texture);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}