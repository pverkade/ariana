/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>
/// <reference path="filter"/>


class BrightnessProgram extends FilterProgram {
    protected brightnessLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "brightness.frag");
        super(gl);
        this.brightnessLocation = this.gl.getUniformLocation(this.program, "u_brightness");
    }

    setUniforms(brightness : number) : void {
        this.gl.uniform1f(this.brightnessLocation, brightness);
    }
}

class BrightnessFilter extends Filter {
    protected filterType = FilterType.Brightness;
    protected static program : BrightnessProgram;

    constructor (gl : WebGLRenderingContext) {
        super(gl);
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
            BrightnessFilter.program = new BrightnessProgram(this.gl);
        }
    }

    render (texture : WebGLTexture) {
        BrightnessFilter.program.activate();
        BrightnessFilter.program.bindTexture(texture);
        BrightnessFilter.program.setUniforms(this.attributes["brightness"]["value"]);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}