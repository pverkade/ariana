/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>

class RenderEngine {
    drawOrder : Array<Layer>;
    clientOrder : Array<Layer>;
    drawbuffer : DrawBuffer;

    width : number;
    height : number;

    constructor (width : number, height : number) {
        this.drawOrder = new Array();
        this.clientOrder = new Array();
        this.drawbuffer = new DrawBuffer(width, height);

        this.width = width;
        this.height = height;
    }

    addLayer(layer : Layer) {
        this.clientOrder.push(layer);
        layer.setDepth(this.clientOrder.length);

        if (this.drawOrder.length === 0) {
            //console.log("Adding first layer to draworder");
            this.drawOrder.push(layer);
        }

        for (var i = 0; i < this.drawOrder.length; i++) {
            if (this.drawOrder[i].layerType <= layer.layerType) {
                this.drawOrder.splice(i, 0, layer);
                //console.log("Added layer at position " + i + " to draworder");
                return;
            }
        }
    }

    removeLayer(index : number) {
        var id = this.clientOrder[index].ID;
        this.clientOrder.splice(index, 1);

        for (var i = 0; i < this.drawOrder.length; i++) {
            if (this.drawOrder[i].ID == id) {
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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var oldType = -1;
        var numItems = this.drawOrder.length;
        for (var i = 0; i < numItems; i++) {
            var layer = this.drawOrder[i];
            if (layer.layerType != oldType) {
                layer.setupRender();
                oldType = layer.layerType;
            }

            layer.render(numItems);
        }
    }

    renderToImg() {
        var buffer : DrawBuffer = new DrawBuffer(this.width, this.height);
        buffer.bind();
        this.render();
        var val = buffer.getImage();
        buffer.unbind();
        return val;
    }
}