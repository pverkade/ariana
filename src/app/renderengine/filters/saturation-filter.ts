/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="../shader-program"/>
/// <reference path="../render-helper"/>
/// <reference path="../image-shader-program"/>
/// <reference path="../resource-manager"/>
/// <reference path="filter"/>

class SaturationProgram extends FilterProgram {
    protected intensityLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "saturation.frag");
        super(gl);
        this.intensityLocation = this.gl.getUniformLocation(this.program, "u_intensity");
    }

    setUniforms(intensity : number) : void {
        this.gl.uniform1f(this.intensityLocation, intensity);
    }
}

class SaturationFilter extends Filter {
    protected filterType = FilterType.Saturation;
    protected program : SaturationProgram;

    constructor () {
        super();
        this.attributes = {
            "intensity" : {
                "value" : 1.0,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 2),
                "max": 2,
                "min": 0.05,
                "step": 0.05,
            }
        };
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.saturationProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(this.getAttributeValue("intensity"));

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
