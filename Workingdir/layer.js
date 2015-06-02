/// <reference path="gl-matrix"/>
var Layer = (function () {
    function Layer() {
        this.ID = Layer.MaxID++;
        this.scaleMatrix = mat3.create();
        this.rotationMatrix = mat3.create();
        this.translationMatrix = mat3.create();
    }
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
    Layer.prototype.setDepth = function (depth) {
        this.depth = depth;
    };
    Layer.prototype.getDepth = function () {
        return this.depth;
    };
    Layer.prototype.getID = function () {
        return this.ID;
    };
    Layer.prototype.setupRender = function () { };
    ;
    Layer.prototype.render = function () { };
    ;
    Layer.MaxID = 0;
    return Layer;
})();
