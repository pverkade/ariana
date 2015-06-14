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

class NoiseProgram extends FilterProgram {
    protected intensityLocation;
    protected seedLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "noise.frag");
        super(gl);
        this.intensityLocation = this.gl.getUniformLocation(this.program, "u_intensity");
        this.seedLocation = this.gl.getUniformLocation(this.program, "u_seed");
    }

    setUniforms(intensity : number, seed1 : number, seed2 : number, seed3 : number) : void {
        this.gl.uniform1f(this.intensityLocation, intensity);
        this.gl.uniform3f(this.seedLocation, seed1, seed2, seed3);
    }
}

class NoiseFilter extends Filter {
    protected filterType = FilterType.Noise;
    protected program : NoiseProgram;

    constructor () {
        super();
        this.attributes = {
            "intensity" : {
                "value" : 0.1,
                "type" : FilterValueType.Slider,
                "setter" : (x) => clamp(x, 0, 0.25),
                "max": 0.25,
                "min": 0.0,
                "step": 0.05,
            }
        };
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.noiseProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);
        this.program.setUniforms(this.getAttributeValue("intensity"), Math.random(), Math.random(), Math.random());

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
