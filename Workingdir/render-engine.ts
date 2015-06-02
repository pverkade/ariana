/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>

function createImageFromTexture(gl, drawbuffer, width, height) : HTMLImageElement {
    // Create a framebuffer backed by the texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, drawbuffer.framebuffer);
    //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, drawbuffer.texture, 0);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, drawbuffer.renderbuffer);

    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

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
    drawbuffer : DrawBuffer;

    width = 640;
    height = 640;

    constructor () {
        this.drawOrder = new Array();
        this.clientOrder = new Array();
        this.drawbuffer = new DrawBuffer(this.width, this.height);
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

    render(drawbuffer? : DrawBuffer) {
        if (drawbuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, drawbuffer.framebuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, drawbuffer.renderbuffer);
            //drawbuffer.bindTexture();
        }

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

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    framebufferToImage() : HTMLImageElement {
        //var pixels = new Uint8Array(this.width * this.height * 4);
        //gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        this.drawbuffer.bindTexture();
        this.render(this.drawbuffer.framebuffer);

        return createImageFromTexture(gl, this.drawbuffer, this.width, this.height);

    }
}