/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>

function compareLayers(layer1 : Layer, layer2 : Layer) {
    return layer1.ID - layer2.ID;
}

interface Uint8ClampedArray {
    set(x);
}

function createImageFromTexture(gl, texture, width, height) {
    // Create a framebuffer backed by the texture
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);

    // Create a 2D canvas to store the result
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    var imageData : ImageData = context.createImageData(width, height);
    var temp : any = <any>imageData.data;
    (<any>(imageData.data)).set(data);
    context.putImageData(imageData, 0, 0);

    var img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

class RenderEngine {
    drawOrder : Array<Layer>;
    clientOrder : Array<Layer>;

    constructor () {
        this.drawOrder = new Array();
        this.clientOrder = new Array();
    }

    addLayer(layer : Layer) {
        this.clientOrder.push(layer);
        layer.setDepth(this.clientOrder.length);

        if (this.drawOrder.length === 0) {
            this.drawOrder.push(layer);
        }

        for (var i = 0; i < this.drawOrder.length; i++) {
            if (this.drawOrder[i].layerType <= layer.layerType) {
                this.drawOrder.splice(i, 0, layer);
                return;
            }
        }
    }

    removeLayer(layer : Layer, id : number) {
        for (var i = 0; i < this.clientOrder.length; i++) {
            if (layer.ID == id) {
                this.clientOrder.splice(i, 1);
            }
        }

        for (var i = 0; i < this.drawOrder.length; i++) {
            if (layer.ID == id) {
                this.drawOrder.splice(i, 1);
                return;
            }
        }
    }

    reorder(i : number, j : number) {
        var tempDepth = this.clientOrder[i].getDepth();
        this.clientOrder[i].setDepth(this.clientOrder[j].getDepth());
        this.clientOrder[j].setDepth(tempDepth);

        var temp = this.clientOrder[i];
        this.clientOrder[i] = this.clientOrder[j];
        this.clientOrder[j] = temp;
    }

    render() {
        var oldType = -1;
        gl.activeTexture(gl.TEXTURE0);

        for (var i = 0; i < this.drawOrder.length; i++) {
            var layer = this.drawOrder[i];
            if (layer.layerType != oldType) {
                layer.setupRender();
                oldType = layer.layerType;
            }

            layer.render();
        }
    }

    framebufferToImage() : Uint8Array {
        var width = 640;
        var height = 640;
        var pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        return createImageFromTexture(gl, texture, width, height);

    }
}