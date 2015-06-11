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

class InvertColorsProgram extends FilterProgram {
    protected brightnessLocation;

    constructor(gl : WebGLRenderingContext) {
        super.setShaderSource("filter.vert", "invert-colors.frag");
        super(gl);
    }
}

class InvertColorsFilter extends Filter {
    protected filterType = FilterType.InvertColors;
    protected program : InvertColorsProgram;

    constructor () {
        super();
    }

    render (resourceManager : ResourceManager, texture : WebGLTexture) {
        super.render(resourceManager, texture);
        if (!this.program) {
            this.program = resourceManager.invertColorsProgramInstance();
        }

        this.program.activate();
        this.program.bindTexture(texture);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}