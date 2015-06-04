/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>
/// <reference path="filter"/>
/// <reference path="image-layer"/>

class RenderEngine {
    /* Array of layers in the order that the user sees them */
    layers : Array<Layer>;
    drawbuffer1 : DrawBuffer;
    drawbuffer2 : DrawBuffer;

    /* Width and height of the framebuffer */
    width : number;
    height : number;

    constructor (width : number, height : number) {
        this.layers = new Array();
        this.drawbuffer1 = new DrawBuffer(width, height);
        this.drawbuffer2 = new DrawBuffer(width, height);

        this.width = width;
        this.height = height;
    }

    addLayer(layer : Layer) {
        /* Append layer to user array */
        this.layers.push(layer);
    }
 
    removeLayer(index : number) {
        var layer : Layer = this.layers[index];
        this.layers.splice(layer.ID, 1);
        layer.destroy();
        delete layer;
    }

    reorder(i : number, j : number) {
        /* Switch places in the user array */
        var temp = this.layers[i];
        this.layers[i] = this.layers[j];
        this.layers[j] = temp;
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var oldType = -1;
        var numItems = this.layers.length;

        /* Draw all layers to the currently bound framebuffer */
        for (var i = 0; i < numItems; i++) {
            var layer = this.layers[i];
            if (layer.layerType != oldType) {
                /*
                 * We're drawing a different type of layer then our previous one,
                 * so we need to do some extra stuff.
                 */
                layer.setupRender();
                oldType = layer.layerType;
            }

            layer.render(numItems);
        }
    }

    filterLayers(layerIndices : number[], filter : Filter) {
        for (var i = 0; i < layerIndices.length; i ++) {
            var layer = this.layers[layerIndices[i]];
            if (layer.layerType !== LayerType.ImageLayer) {
                continue;
            }

            var imageLayer = <ImageLayer> layer;
            this.drawbuffer1.bind();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            imageLayer.setupRender();
            imageLayer.render();
            this.drawbuffer1.unbind();

            this.drawbuffer2.bind();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            filter.render(this.drawbuffer1.getWebGlTexture());
            imageLayer.copyFramebuffer(this.width, this.height);
            this.drawbuffer2.unbind();

            imageLayer.setDefaults();

            // Replace layer with ImageLayer (if it was not an ImageLayer) or set the texture of ImageLayer to buffer2.getWebGLTexture();
        }
        this.drawbuffer2.unbind();
    }

    renderToImg() {
        /* Render all layers to a framebuffer and return a 64base encoded image */
        this.drawbuffer1.bind();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.render();
        var val = this.drawbuffer1.getImage();
        this.drawbuffer1.unbind();

        return val;
    }

    destroy() {
        for (var i = 0; i < this.layers.length; i++) {
            //this.layers[i].destroy();
        }

        this.drawbuffer1.destroy();
        this.drawbuffer2.destroy();
    }
}