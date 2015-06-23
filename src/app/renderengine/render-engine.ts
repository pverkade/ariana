/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>
/// <reference path="filters/filter"/>
/// <reference path="image-layer"/>
/// <reference path="resource-manager"/>

class RenderEngine implements MLayer.INotifyPropertyChanged {
    private gl : WebGLRenderingContext;

    /* Array of layers in the order that the user sees them */
    public layers : Array<Layer>;
    private drawbuffer1 : DrawBuffer;
    private drawbuffer2 : DrawBuffer;
    private thumbnailDrawbuffer : DrawBuffer;

    /* Width and height of the framebuffer */
    private width : number;
    private height : number;

    private thumbnailWidth = 192;
    private thumbnailHeight = 192;

    public resourceManager;

    constructor (canvas : HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;        
        this.thumbnailHeight = Math.round(this.thumbnailWidth * (this.height / this.width)); 
        
        this.layers = new Array();

        try {
            /* Try to grab the standard context. If it fails, fallback to experimental. */
            this.gl = <WebGLRenderingContext> (
                canvas.getContext("webgl", {stencil:true, preserveDrawingBuffer: true}) ||
                canvas.getContext("experimental-webgl", {stencil:true, preserveDrawingBuffer: true})
            );
            var contextAttributes = this.gl.getContextAttributes();
            var haveStencilBuffer = contextAttributes.stencil;

            if (!haveStencilBuffer) {
                console.log("Your browser has limited support for WebGL (missing stencil buffer).\nSelection will not work!");
            }

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }
        catch(e) {
            alert("Your device/browser doesnt support WebGL!\ncheck console for stacktrace.");
            console.log(e.stack);
        }
        this.gl.viewport(0, 0, this.width, this.height);
        this.drawbuffer1 = new DrawBuffer(this.gl, this.width, this.height);
        this.drawbuffer2 = new DrawBuffer(this.gl, this.width, this.height);
        this.thumbnailDrawbuffer = new DrawBuffer(this.gl, this.thumbnailWidth, this.thumbnailHeight);
        this.resourceManager = new ResourceManager(this.gl);
    }

    getLayer(index : number) {
        return this.layers[index];
    }

    getLayers(indices : number[]) : Layer[] {
        var result : Layer[] = [];

        for (var i = 0; i < indices.length; i++) {
            result.push(this.layers[indices[i]]);
        }

        return result;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
    public addLayer(layer : Layer) {
        /* Append layer to user array */
        this.insertLayer(layer, this.layers.length);
    }

    public insertLayer(layer : Layer, index : number) {
        layer.registerNotifyPropertyChanged(this);
        this.createThumbnail(layer);
        this.layers.splice(index, 0, layer);
    }

    public removeLayer(index : number) {
        var layer : Layer = this.layers[index];
        this.layers.splice(index, 1);
        layer.destroy();
    }

    public reorder(i : number, j : number) {
        /* Switch places in the user array */
        var temp = this.layers[i];
        this.layers[i] = this.layers[j];
        this.layers[j] = temp;
    }

    public render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        var oldType = -1;
        var numItems = this.layers.length;

        /* Draw all layers to the currently bound framebuffer */
        for (var i = 0; i < numItems; i++) {
            var layer = this.layers[i];
            if (layer.isHidden()) {
                continue;
            }

            if (layer.getLayerType() != oldType) {
                /*
                 * We're drawing a different type of layer then our previous one,
                 * so we need to do some extra stuff.
                 */
                layer.setupRender();
                oldType = layer.getLayerType();
            }

            layer.render();
        }
    }

    public getPixelColor(x : number, y : number) : Uint8Array {
        var value = new Uint8Array(4);
        this.gl.readPixels(x, this.height-y-1, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, value);
        return value;
    }

    public destroy() {

        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].destroy();
        }

        this.drawbuffer1.destroy();
        this.drawbuffer2.destroy();
    }

    private createThumbnail(layer : Layer) {
        this.thumbnailDrawbuffer.bind();
        this.gl.viewport(0, 0, this.thumbnailWidth, this.thumbnailHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        layer.setupRender();
        layer.render();
        layer.setThumbnail(this.thumbnailDrawbuffer.getImage());
        this.thumbnailDrawbuffer.unbind();
        this.gl.viewport(0, 0, this.width, this.height);
    }

    public propertyChanged(layer : Layer) {
        this.createThumbnail(layer);
    }

    private renderIndices(indices : number[], drawHiddenLayers = false) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        var oldType = -1;
        for (var i = 0; i < indices.length; i++) {
            // Take the old layer (one layer at a time)
            var layer:Layer = this.layers[indices[i]];

            if (!drawHiddenLayers && layer.isHidden()) {
                continue;
            }

            if (layer.getLayerType() != oldType) {
                /*
                 * We're drawing a different type of layer then our previous one,
                 * so we need to do some extra stuff.
                 */
                layer.setupRender();
                oldType = layer.getLayerType();
            }
            layer.render();
        }
    }

    public renderIndicesToImg(indices : number[], drawHiddenLayers = false) : String {
        this.drawbuffer1.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        this.renderIndices(indices, drawHiddenLayers);

        var data : String = this.drawbuffer1.getImage();
        this.drawbuffer1.unbind();

        return data;
    }

    public renderToImg() : String {
        var indices : number[] = [];
        for (var i = 0; i < this.layers.length; i++) {
            indices.push(i);
        }
        return this.renderIndicesToImg(indices);
    }

    public rasterize(indices : number[]) : ImageLayer {
        /* Draw the old layer in drawbuffer1 */
        this.drawbuffer1.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        this.renderIndices(indices);

        /* Create a new image layer that copies over the framebuffer */
        var tmpLayer : ImageLayer = this.createImageLayer(null);
        tmpLayer.copyFramebuffer(this.width, this.height);

        /* Draw in drawbuffer 2 again so we dont flip vertically (fcking OpenGL again) */
        this.drawbuffer2.bind();
        tmpLayer.setupRender();
        tmpLayer.render();

        /* Copy over again from drawbuffer 2 */
        var newLayer : ImageLayer = this.createImageLayer(null);
        newLayer.copyFramebuffer(this.width, this.height);
        this.drawbuffer2.unbind();

        return newLayer;
    }

    public createImageLayer(image : HTMLImageElement) : ImageLayer {
        return new ImageLayer(
            this.resourceManager,
            this.width,
            this.height,
            image
        );
    }

    public createSelectionImageLayer(bitmask: HTMLImageElement, layerIndex: number): ImageLayer {
        var gl = this.gl;

        if (this.layers[layerIndex].getLayerType() != LayerType.ImageLayer) {
            return;
        }
        var layer = <ImageLayer>this.layers[layerIndex];
        console.log("x of to select layer: " + layer.getPosX());

        var width = bitmask.width;
        var height = bitmask.height;
        var selectedLayer = this.createImageLayer(layer.getImage());
        //var invertedSelectedLayer = this.createImageLayer(layer.getImage());
        //invertedSelectedLayer.setPos(layer.getPosX(), layer.getPosY());
        //invertedSelectedLayer.setRotation(layer.getRotation());

        var bitmaskProgram = this.resourceManager.bitmaskProgramInstance();
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmask);

        var drawbuffer = new DrawBuffer(gl, width, height);
        drawbuffer.bind();
        gl.viewport(0, 0, width, height);

        gl.enable(this.gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        /* Draw bitmask stencil */
        bitmaskProgram.activate();
        bitmaskProgram.setUniforms(texture);
        gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        /* Draw the selected part of the image */
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.stencilFunc(gl.EQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        layer.setupRender();
        layer.renderFullscreen();
        selectedLayer.copyFramebuffer(width, height);

        /* Draw the not selected part of the image */
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        layer.setupRender();
        layer.renderFullscreen();
        layer.copyFramebuffer(width, height);

        this.gl.disable(this.gl.STENCIL_TEST);
        drawbuffer.unbind();
        gl.viewport(0, 0, this.width, this.height);

        selectedLayer.setPos(layer.getPosX(), layer.getPosY());
        selectedLayer.setRotation(layer.getRotation());
        selectedLayer.setDimensions(layer.getWidth(), layer.getHeight());
        return selectedLayer;
    }

    public resize(width : number, height : number) {
        this.width = width;
        this.height = height;

        this.thumbnailHeight = Math.round(this.thumbnailWidth * (this.height / this.width));
        this.thumbnailDrawbuffer = new DrawBuffer(this.gl, this.thumbnailWidth, this.thumbnailHeight);
                
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].destroy();
        }
        this.layers = new Array();

        this.drawbuffer1.destroy();
        this.drawbuffer2.destroy();

        this.gl.viewport(0, 0, this.width, this.height);
        this.drawbuffer1 = new DrawBuffer(this.gl, this.width, this.height);
        this.drawbuffer2 = new DrawBuffer(this.gl, this.width, this.height);
        this.render();
    }
}