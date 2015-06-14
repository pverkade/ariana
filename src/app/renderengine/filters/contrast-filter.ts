/**
 * Created by zeta on 6/4/15.
 */

/// <reference path="../shader-program"/>
/// <reference path="../render-helper"/>
/// <reference path="../image-shader-program"/>
/// <reference path="filter"/>

class ContrastProgram extends FilterProgram {
    private contrastValueLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "contrast.frag");
        super(gl);
        this.contrastValueLocation = this.gl.getUniformLocation(this.program, "u_contrastValue");
    }

    setUniforms(contrastValue : number) : void {
        this.gl.uniform1f(this.contrastValueLocation, contrastValue);
    }
}

class ContrastFilter extends Filter {
    protected filterType = FilterType.Contrast;
    protected  program : ContrastProgram;

    constructor () {
        super();
        this.attributes = {
            "contrastValue" : {
                "value" : 1,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0.5, 3),
                "max": 3,
                "min": 0.5,
                "step": 0.1,
            }
        };

    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.contrastProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(this.attributes["contrastValue"]["value"]);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
