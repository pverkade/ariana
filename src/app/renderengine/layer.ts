/// <reference path="gl-matrix"/>
/// <reference path="resource-manager"/>

enum LayerType {ImageLayer};

module MLayer {
    export interface INotifyPropertyChanged {
        propertyChanged(layer : Layer);
    }
}

class Layer {
    protected gl : WebGLRenderingContext;
    protected resourceManager : ResourceManager;
	protected static MaxID = 0;
	protected layerType : number;
	private ID : LayerType;
	protected angle : number;
    protected width : number;
    protected height : number;
	protected posX : number;
	protected posY : number;
    private thumbnail : String;
    private hidden : boolean;

	public sizeMatrix : Float32Array;
	public rotationMatrix : Float32Array;
	public translationMatrix : Float32Array;
    public pixelConversionMatrix : Float32Array;

    private propertyChanged : MLayer.INotifyPropertyChanged;
    private propertyChangedTimeout;

	constructor(
        resourceManager : ResourceManager,
        canvasWidth : number,
        canvasHeight : number,
        width : number,
        height : number) {
        this.gl = resourceManager.getWebGLContext();
        this.resourceManager = resourceManager;
		this.ID = Layer.MaxID++;

		this.sizeMatrix = mat3.create();
		this.rotationMatrix = mat3.create();
		this.translationMatrix = mat3.create();
        this.pixelConversionMatrix = mat3.create();

        /* Apperently calling a function on this object from within the constructor crashes it */
        this.posX = 0.0;
        this.posY = 0.0;
        this.width = width;
        this.height = height;
        this.angle = 0.0;
        this.hidden = false;

        mat3.identity(this.sizeMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
        mat3.identity(this.pixelConversionMatrix);

        mat3.translate(
            this.pixelConversionMatrix,
            this.pixelConversionMatrix,
            new Float32Array([-1.0, 1.0])
        );
        mat3.scale(
            this.pixelConversionMatrix,
            this.pixelConversionMatrix,
            new Float32Array([2.0/canvasWidth, 2.0/canvasHeight])
        );

        mat3.scale(
            this.sizeMatrix,
            this.sizeMatrix,
            new Float32Array([width/2.0, height/2.0])
        );
	}

    protected notifyPropertyChanged() {
        if (this.propertyChanged != null) {
            if (this.propertyChangedTimeout) {
                clearTimeout(this.propertyChangedTimeout);
            }
            var thisPointer = this;
            this.propertyChangedTimeout = setTimeout(
                function() {
                    thisPointer.propertyChanged.propertyChanged(thisPointer);
                },
                300
            );
        }
    }

    public registerNotifyPropertyChanged(propertyChanged : MLayer.INotifyPropertyChanged) {
        this.propertyChanged = propertyChanged;
    }

	public setRotation(angle : number) {
		this.angle = angle;
		mat3.identity(this.rotationMatrix);
		mat3.rotate(this.rotationMatrix, this.rotationMatrix, angle);

        this.notifyPropertyChanged();
	}

	public getRotation() : number {
		return this.angle;
	}

	public setWidth(width : number) {
		this.setDimensions(width, this.height);
	}

	public setHeight(height : number) {
        this.setDimensions(this.width, height);
	}

    public setThumbnail(thumbnail : String) {
        this.thumbnail = thumbnail;
    }

	public setDimensions(width : number, height : number) {
        this.width = width;
        this.height = height;

		mat3.identity(this.sizeMatrix);
        mat3.scale(
            this.sizeMatrix,
            this.sizeMatrix,
            new Float32Array([width/2.0, height/2.0])
        );

        this.notifyPropertyChanged();
	}

	public setPos(x : number, y : number) {
		this.posX = x;
		this.posY = y;

		mat3.identity(this.translationMatrix);
		mat3.translate(this.translationMatrix, this.translationMatrix, new Float32Array([x, -y]));

        this.notifyPropertyChanged();
	}

    public setHidden(hidden : boolean) {
        this.hidden = hidden;
    }

	public getPosX() : number {
		return this.posX;
	}

	public getPosY() : number {
		return this.posY;
	}

    public getWidth() : number {
        return this.width;
    }

    public getHeight() : number {
        return this.height;
    }

	public getID() : number {
		return this.ID;
	}

    public getLayerType() : LayerType {
        return this.layerType;
    }

    public getThumbnail() : String {
        return this.thumbnail;
    }

    public isHidden() : boolean {
        return this.hidden;
    }

	public setupRender() { }
	public render() { }

    public destroy() {
        delete this.rotationMatrix;
        delete this.sizeMatrix;
        delete this.translationMatrix;
        delete this.pixelConversionMatrix;
    }
}