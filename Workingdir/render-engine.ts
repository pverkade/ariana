/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>
/// <reference path="filter"/>
/// <reference path="image-layer"/>

class RenderEngine {
    /* Array of layers in the order that we draw them */
    drawOrder : Array<Layer>;

    /* Array of layers in the order that the user sees them */
    clientOrder : Array<Layer>;
    drawbuffer1 : DrawBuffer;
    drawbuffer2 : DrawBuffer;

    /* Width and height of the framebuffer */
    width : number;
    height : number;

    filterPrograms;// = {(FilterType.Brightness) : null};

    constructor (width : number, height : number) {
        this.drawOrder = new Array();
        this.clientOrder = new Array();
        this.drawbuffer1 = new DrawBuffer(width, height);
        this.drawbuffer2 = new DrawBuffer(width, height);

        this.width = width;
        this.height = height;
    }

    addLayer(layer : Layer) {
        /* Append layer to user array */
        this.clientOrder.push(layer);
        layer.setDepth(this.clientOrder.length);


        /* Insert layer into the draw array so that it groups the same kind of layers */
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
 
    removeLayer(index : number) {
        var id = this.clientOrder[index].ID;
        this.clientOrder.splice(index, 1);

        /* Remove layer from draw array */
        for (var i = 0; i < this.drawOrder.length; i++) {
            if (this.drawOrder[i].ID == id) {
                this.drawOrder.splice(i, 1);
                return;
            }
        }
    }

    reorder(i : number, j : number) {
        /* Switch depth values */
        var tempDepth = this.clientOrder[i].getDepth();
        this.clientOrder[i].setDepth(this.clientOrder[j].getDepth());
        this.clientOrder[j].setDepth(tempDepth);

        /* Switch places in the user array */
        var temp = this.clientOrder[i];
        this.clientOrder[i] = this.clientOrder[j];
        this.clientOrder[j] = temp;
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var oldType = -1;
        var numItems = this.drawOrder.length;

        /* Draw all layers to the currently bound framebuffer */
        for (var i = 0; i < numItems; i++) {
            var layer = this.drawOrder[i];
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
            var layer = this.clientOrder[i];
            if (layer.layerType !== LayerType.ImageLayer) {
                continue;
            }

            var imageLayer = <ImageLayer> layer;
            this.drawbuffer1.bind();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            imageLayer.render(this.drawOrder.length);

            this.drawbuffer2.bind();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var filterProgram = this.filterPrograms[filter.filterType];

            filterProgram.render(this.drawbuffer1.getWebGlTexture(), 0);

            var newTexture = this.drawbuffer2.texture;
            var oldTexture = imageLayer.switchTexture(newTexture);
            this.drawbuffer2.setWebGlTexture(oldTexture);

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
}