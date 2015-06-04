/// <reference path="gl-matrix"/>
var LayerType;
(function (LayerType) {
    LayerType[LayerType["ImageLayer"] = 0] = "ImageLayer";
})(LayerType || (LayerType = {}));
;
var Layer = (function () {
    function Layer() {
        this.ID = Layer.MaxID++;
        this.scaleMatrix = mat3.create();
        this.rotationMatrix = mat3.create();
        this.translationMatrix = mat3.create();
        /* Apperently calling a function on this object from within the constructor crashes it */
        this.posX = 0;
        this.posY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        mat3.identity(this.scaleMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
    }
    Layer.prototype.setDefaults = function () {
        this.posX = 0;
        this.posY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        mat3.identity(this.scaleMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.translationMatrix);
    };
    Layer.prototype.setRotation = function (angle) {
        this.angle = angle;
        mat3.identity(this.rotationMatrix);
        mat3.rotate(this.rotationMatrix, this.rotationMatrix, angle);
    };
    Layer.prototype.getRotation = function () {
        return this.angle;
    };
    Layer.prototype.setScale = function (scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        mat3.identity(this.scaleMatrix);
        mat3.scale(this.scaleMatrix, this.scaleMatrix, new Float32Array([scaleX, scaleY]));
    };
    Layer.prototype.getScaleX = function () {
        return this.scaleX;
    };
    Layer.prototype.getScaleY = function () {
        return this.scaleY;
    };
    Layer.prototype.setPos = function (x, y) {
        this.posX = x;
        this.posY = y;
        this.translationMatrix = mat3.identity(this.translationMatrix);
        mat3.translate(this.translationMatrix, this.translationMatrix, new Float32Array([x, y]));
    };
    Layer.prototype.getPosX = function () {
        return this.posX;
    };
    Layer.prototype.getPosY = function () {
        return this.posY;
    };
    Layer.prototype.getID = function () {
        return this.ID;
    };
    Layer.prototype.setupRender = function () {
    };
    Layer.prototype.render = function (depthFrac) {
    };
    Layer.MaxID = 0;
    return Layer;
})();
//# sourceMappingURL=layer.js.map