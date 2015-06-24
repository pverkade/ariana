/*
 * The render engine is used for drawing most of the things you see on the screen
 * The main uses are drawing layers, creating thumbnails and cutting out selections.
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

    /* Render all layers that are not hidden */
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

    /* Get the color at a given coordinate */
    public getPixelColor(x : number, y : number) : Uint8Array {
        var value = new Uint8Array(4);
        this.gl.readPixels(x, this.height-y-1, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, value);
        return value;
    }

    /* Create a thumbnail for a layer */
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

    /* When a layer changed we need to create new thumbnail */
    public propertyChanged(layer : Layer) {
        this.createThumbnail(layer);
    }

    /* Render only a given set of indices, also when they're set to hidden */
    private renderIndices(indices : number[]) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        var oldType = -1;
        for (var i = 0; i < indices.length; i++) {
            /* Take the old layer (one layer at a time) */
            var layer:Layer = this.layers[indices[i]];
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

    /* Render indices to an image that is returned as base64 string */
    public renderIndicesToImg(indices : number[]) : String {
        this.drawbuffer1.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        this.renderIndices(indices);

        var data : String = this.drawbuffer1.getImage();
        this.drawbuffer1.unbind();

        return data;
    }

    /* Render all layers (hidden ones too) to an image and return base64 string */
    public renderToImg() : String {
        var indices : number[] = [];
        for (var i = 0; i < this.layers.length; i++) {
            indices.push(i);
        }
        return this.renderIndicesToImg(indices);
    }

    public createImageLayer(image : HTMLImageElement) : ImageLayer {
        return new ImageLayer(
            this.resourceManager,
            this.width,
            this.height,
            image
        );
    }

    /*
     * Given a bitmask and an image layer (or at least the index) we:
     *  - replace the image layer with the part that is not in the selection
     *  - return a new image layer with the part that is in the selection
     */
    public createSelectionImageLayer(bitmask: HTMLImageElement, layerIndex: number) : ImageLayer {
        var gl = this.gl;

        if (this.layers[layerIndex].getLayerType() != LayerType.ImageLayer) {
            return;
        }
        var layer = <ImageLayer>this.layers[layerIndex];

        var width = bitmask.width;
        var height = bitmask.height;

        /* Create an image layer that will contain the selected part */
        var selectedLayer = this.createImageLayer(null);

        var bitmaskProgram = this.resourceManager.bitmaskProgramInstance();

        /* Copy the bitmask to GPU memory */
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmask);


        /* Draw the bitmask to the stencil buffre */
        var drawbuffer = new DrawBuffer(gl, width, height);
        drawbuffer.bind();
        gl.viewport(0, 0, width, height);

        gl.enable(this.gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        bitmaskProgram.activate();
        bitmaskProgram.setUniforms(texture);
        gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);


        /* Draw the selected part of the image and put it in the new image layer*/
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.stencilFunc(gl.EQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        layer.setupRender();
        layer.renderFullscreen();
        selectedLayer.copyFramebuffer(width, height);

        /* Draw the not selected part of the image and put it in the original image layer */
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

    /*
     * Resize the drawbuffers and destroy all the layers (as we dont know what to do when the resolution changes)
     */
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