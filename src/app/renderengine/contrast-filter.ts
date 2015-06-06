/**
 * Created by zeta on 6/4/15.
 */
 
/*
/// <reference path="shader-program"/>
/// <reference path="render-helper"/>
/// <reference path="image-shader-program"/>
/// <reference path="filter"/>

class ContrastProgram extends FilterProgram {
    contrastValueLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter-vs", "contrast-fs");
        super(gl);
        this.contrastValueLocation = this.gl.getUniformLocation(this.program, "u_contrastValue");
    }

    setUniforms(contrastValue : number) : void {
        this.gl.uniform1f(this.contrastValueLocation, contrastValue);
    }
}

class ContrastFilter extends Filter {
    filterType = FilterType.Contrast;
    static program : ContrastProgram;

    constructor (gl : WebGLRenderingContext) {
        super(gl);
        this.attributes = {
            "contrastValue" : {
                "value" : 1,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 2.5),
                "max": 2.5,
                "min": 0
            }
        };

        if (!ContrastFilter.program) {
            ContrastFilter.program = new ContrastProgram(this.gl);
        }
    }

    render (texture : WebGLTexture) {
        ContrastFilter.program.activate();
        ContrastFilter.program.bindTexture(texture);
        ContrastFilter.program.setUniforms(this.attributes["contrastValue"]["value"]);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}*/
