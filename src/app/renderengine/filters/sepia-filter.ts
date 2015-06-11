/**
 * Created by zeta on 6/9/15.
 */
/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="../shader-program"/>
/// <reference path="../render-helper"/>
/// <reference path="../image-shader-program"/>
/// <reference path="../resource-manager"/>
/// <reference path="filter"/>

class SepiaProgram extends FilterProgram {
    protected depthLocation;
    protected intensityLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "sepia.frag");
        super(gl);
        this.depthLocation = this.gl.getUniformLocation(this.program, "u_depth");
        this.intensityLocation = this.gl.getUniformLocation(this.program, "u_intensity");
    }

    setUniforms(depth : number, intensity : number) : void {
        this.gl.uniform1f(this.depthLocation, depth);
        this.gl.uniform1f(this.intensityLocation, intensity);
    }
}

class SepiaFilter extends Filter {
    protected filterType = FilterType.Sepia;
    protected program : SepiaProgram;

    constructor () {
        super();
        this.attributes = {
            "depth" : {
                "value" : 0.1,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 0.5),
                "max": 0,
                "min": 0.5
            },
            "intensity" : {
                "value" : 0.2,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0.05, 0.4),
                "max": 0.05,
                "min": 0.4
            }
        };
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.sepiaProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(this.getAttributeValue("depth"), this.getAttributeValue("intensity"));

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}