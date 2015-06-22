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

    transformHistory : Float32Array[];
    private transformed = true;
    private transformedDimensions : number[];

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
        this.transformHistory = [];

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

    public commitRotation() {
        var matrix = mat3.create();
        mat3.identity(matrix);
        mat3.rotate(matrix, matrix, this.angle);
        this.transformHistory.push(matrix);

        this.angle = 0;

        mat3.identity(this.rotationMatrix);
    }

	public setRotation(angle : number) {
		this.angle = angle;
		mat3.identity(this.rotationMatrix);
		mat3.rotate(this.rotationMatrix, this.rotationMatrix, angle);

        this.notifyPropertyChanged();
        this.transformed = true;
	}

    public commitTransformations() {
        var matrix : Float32Array = mat3.create();
        mat3.identity(matrix);

        for (var i = 0; i < this.transformHistory.length; i ++) {
            mat3.multiply(matrix, this.transformHistory[i], matrix);
        }

        this.transformHistory = [matrix];
    }

	public getRotation() : number {
		return this.angle;
	}

	public setWidth(width : number) {
		this.setDimensions(width, this.height);
        this.transformed = true;
	}

	public setHeight(height : number) {
        this.setDimensions(this.width, height);
        this.transformed = true;
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
        this.transformed = true;
	}

	public setPos(x : number, y : number) {
		this.posX = x;
		this.posY = y;

		mat3.identity(this.translationMatrix);
		mat3.translate(this.translationMatrix, this.translationMatrix, new Float32Array([x, -y]));

        this.notifyPropertyChanged();
        this.transformed = true;
	}

    public setHidden(hidden : boolean) {
        this.hidden = hidden;
    }

    public calculateTransformation() : Float32Array {
        var matrix : Float32Array = mat3.create();
        mat3.identity(matrix);

        var historyMatrix : Float32Array = mat3.create();
        mat3.identity(historyMatrix);

        for (var i = 0; i < this.transformHistory.length; i ++) {
            mat3.multiply(historyMatrix, this.transformHistory[i], historyMatrix);
        }

        //mat3.multiply(matrix, matrix, this.pixelConversionMatrix);
        mat3.multiply(matrix, matrix, this.translationMatrix);
        mat3.multiply(matrix, matrix, this.rotationMatrix);
        mat3.multiply(matrix, matrix, this.sizeMatrix);
        mat3.multiply(matrix, matrix, historyMatrix);

        return matrix;
    }

    public getTransformedDimensions() : number[] {
    
        if (this.transformed) {
            var options = [-1, 1];
            var minX : number = Number.POSITIVE_INFINITY;
            var maxX : number = Number.NEGATIVE_INFINITY;

            var minY : number = Number.POSITIVE_INFINITY;
            var maxY : number = Number.NEGATIVE_INFINITY;

            var matrix : Float32Array = this.calculateTransformation();

            for (var i = 0; i < options.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    var vector : Float32Array = vec3.fromValues(options[i], options[j], 1);
                    var outVector : Float32Array = vec3.create();

                    vec3.transformMat3(outVector, vector, matrix);

                    minX = Math.min(minX, outVector[0]);
                    maxX = Math.max(maxX, outVector[0]);

                    minY = Math.min(minY, outVector[1]);
                    maxY = Math.max(maxY, outVector[1]);
                }
            }

            this.transformed = false;
            this.transformedDimensions = [maxX - minX, maxY - minY];
        }
        return this.transformedDimensions;
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