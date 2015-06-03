/**
 * Created by zeta on 6/3/15.
 */
/// <reference path="base-program"/>

enum FilterType {Brightness};

class Filter {
    attributes:Object;
    filterType:FilterType;

    constructor() {
        this.attributes = {};
    }

    setAttribute(name:string, value:any) {
        this.attributes[name] = value
    }

    getAttributeNames():Array<string> {
        return Object.keys(this.attributes);
    }

    render(texture:WebGLTexture) { }
}

class FilterProgram extends BaseProgram {
    program : WebGLProgram;

    samplerLocation : WebGLUniformLocation;

    constructor() {
        super();
        var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        this.samplerLocation = gl.getUniformLocation(this.program, "u_sampler");

        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    }

    activate() : void {
        super.activate();
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.samplerLocation, 0);
    }

    bindTexture(texture : WebGLTexture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }
}