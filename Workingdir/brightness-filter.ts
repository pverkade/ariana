/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>
/// <reference path="filter"/>


class BrightnessProgram extends FilterProgram {
    brightnessLocation;

    constructor() {
        super.setShaderSource("filter-vs", "brightness-fs");
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
            "brightness" : {
                "value" : 1,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 2.5),
                "max": 2.5,
                "min": 0
            }
        };

        if (!BrightnessFilter.program) {
            BrightnessFilter.program = new BrightnessProgram();
        }
    }

    render (texture : WebGLTexture) {
        BrightnessFilter.program.activate();
        BrightnessFilter.program.bindTexture(texture);
        BrightnessFilter.program.setUniforms(this.attributes["brightness"]["value"]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}