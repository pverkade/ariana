/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="../shader-program"/>
/// <reference path="../render-helper"/>
/// <reference path="../image-shader-program"/>
/// <reference path="../resource-manager"/>
/// <reference path="filter"/>

class ColorizeProgram extends FilterProgram {
    protected colorLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "colorize.frag");
        super(gl);
        this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    }

    setUniforms(red : number, green : number, blue) : void {
        this.gl.uniform3f(this.colorLocation, red, green, blue);
    }
}

class ColorizeFilter extends Filter {
    protected filterType = FilterType.Colorize;
    protected program : ColorizeProgram;

    constructor () {
        super();
        this.attributes = {
            "red" : {
                "value" : 0.0,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 1),
                "max": 1,
                "min": 0,
                "step": 0.05,
            },
            "green" : {
                "value" : 0.0,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 1),
                "max": 1,
                "min": 0,
                "step": 0.05,
            },
            "blue" : {
                "value" : 0.0,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 1),
                "max": 1,
                "min": 0,
                "step": 0.05,
            }
        };
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.colorizeProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(
            this.getAttributeValue("red"),
            this.getAttributeValue("green"),
            this.getAttributeValue("blue")
        );

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
