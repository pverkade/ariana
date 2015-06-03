/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>
/// <reference path="filter"/>


class BrightnessProgram extends ImageShaderProgram implements ShaderProgram {
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
    
    render () {
        BrightnessFilter.program.activate();
        BrightnessFilter.program.setStuff();

    }
}