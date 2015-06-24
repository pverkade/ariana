/**
 * Created by zeta on  6/2/15.
 */
/// <reference path="../shader-program"/>
/// <reference path="../render-helper"/>
/// <reference path="../image-shader-program"/>
/// <reference path="../resource-manager"/>
/// <reference path="filter"/>

class ThresholdProgram extends FilterProgram {
    protected thresholdLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "threshold.frag");
        super(gl);
        this.thresholdLocation = this.gl.getUniformLocation(this.program, "u_threshold");
    }

    setUniforms(threshold : number) : void {
        this.gl.uniform1f(this.thresholdLocation, threshold);
    }
}

class ThresholdFilter extends Filter {
    protected filterType = FilterType.Threshold;
    protected program : ThresholdProgram;

    constructor () {
        super();
        this.attributes = {
            "threshold" : {
                "value" : 0,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 1),
                "min": 0,
                "max": 1,
                "step": 0.05,
            }
        };
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.thresholdProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(this.getAttributeValue("threshold"));

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}