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

    private thumbnailWidth = 100;
    private thumbnailHeight = 60;

    public resourceManager;

    constructor (canvas : HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;

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
        this.layers.splice(layer.getID(), 1);
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

    public filterLayers(layerIndices : number[], filter : Filter) {
        for (var i = 0; i < layerIndices.length; i ++) {
            var layer = this.layers[layerIndices[i]];
            if (layer.getLayerType() !== LayerType.ImageLayer) {
                continue;
            }

            var imageLayer = <ImageLayer> layer;
            var textureProgram = this.resourceManager.textureProgramInstance();

            // FIXME: images that are larger than the canvas are downsized when a filter is applied
            this.drawbuffer1.bind();
            {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
                filter.render(this.resourceManager, imageLayer.getWebGlTexture());

                this.gl.bindTexture(this.gl.TEXTURE_2D, imageLayer.getWebGlTexture());
                this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, this.width, this.height, 0);

                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
                textureProgram.render(imageLayer.getWebGlTexture());

                this.gl.bindTexture(this.gl.TEXTURE_2D, imageLayer.getWebGlTexture());
                this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, this.width, this.height, 0);
            }
            this.drawbuffer1.unbind();
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
        layer.thumbnail = this.thumbnailDrawbuffer.getImage();
        this.thumbnailDrawbuffer.unbind();
        this.gl.viewport(0, 0, this.width, this.height);
    }

    public propertyChanged(layer : Layer) {
        this.createThumbnail(layer);
    }

    private renderIndices(indices : number[]) {
        var oldType = -1;
        for (var i = 0; i < indices.length; i++) {
            // Take the old layer (one layer at a time)
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

    public renderIndicesToImg(indices : number[]) : String {
        this.drawbuffer1.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        this.renderIndices(indices);

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

    public createImageLayer(image : ImageData) {
        return new ImageLayer(
            this.resourceManager,
            this.width,
            this.height,
            image
        );
    }
}