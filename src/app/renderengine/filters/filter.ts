/**
 * Created by zeta on 6/3/15.
 */
/// <reference path="../base-program"/>
/// <reference path="../resource-manager"/>

function clamp(x : number, low: number, high: number) {
    return Math.max(low, Math.min(x, high));
}

function normalize100(x, low, high) {
    return clamp(x, 0, 100) / 100 * (high - low) + low;
}

enum FilterType {Brightness, Contrast, Sepia, InvertColors, Saturation, Noise, Colorize}
enum FilterValueType {Slider}

class FilterProgram extends BaseProgram {
    protected program : WebGLRenderingContext;

    protected samplerLocation : WebGLUniformLocation;

    constructor(gl : WebGLRenderingContext) {
        super(gl);
        var texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = this.gl.getUniformLocation(this.program, "u_sampler");

        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.samplerLocation, 0);
    }

    bindTexture(texture : WebGLTexture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }
}

class Filter {
    protected gl : WebGLRenderingContext;
    protected attributes:Object;
    protected filterType:FilterType;

    constructor() {
        this.attributes = {};
    }

    setAttribute(name:string, value:any) :void {
        var attribute = this.attributes[name];
        attribute["value"] = attribute["setter"](value);
    }

    getAttribute(name : string) : Object {
        return this.attributes[name];
    }
    
    getAttributesObject() : Object {
        return this.attributes;
    }

    getAttributeNames() : Array<string> {
        return Object.keys(this.attributes);
    }

    getAttributeValue(name : string) {
        return this.attributes[name]["value"];
    }

    getFilterType() : FilterType {
        return this.filterType;
    }

    render(resourceManager : ResourceManager, texture:WebGLTexture) {
        if (!this.gl) {
            this.gl = resourceManager.getWebGLContext();
        }
    }
}