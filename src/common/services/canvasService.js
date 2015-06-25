app.service('canvas', function() {

    this.getPos = function() {
        return {x: this._params.x, y: this._params.y};
    };

    this.getX = function() {
        return this._params.x;
    };

    this.getY = function() {
        return this._params.y;
    };

    this.getZoom = function() {
        return this._params.zoom;
    };

    this.getDim = function() {
        return {width: this._params.width, height: this._params.height};
    };

    this.getWidth = function() {
        return this._params.width;
    };

    this.getHeight = function() {
        return this._params.height;
    };

    this.getVisibility = function() {
        return this._params.visible;
    };

    this.getCursor = function() {
        return this._params.cursor;
    };

    this.setPos = function(x, y) {
        this._params.x = x;
        this._params.y = y;
    };

    this.setX = function(x) {
        this._params.x = x;
    };

    this.setY = function(y) {
        this._params.y = y;
    };

    this.setZoom = function(zoom) {
        this._params.zoom = zoom;
    };

    this.setDim = function(width, height) {
        this._params.width = width;
        this._params.height = height;
    };

    this.setWidth = function(width) {
        this._params.width = width;
    };

    this.setHeight = function(height) {
        this._params.height = height;
    };

    this.setVisibility = function(status) {
        this._params.visible = status;
    };

    this.setCursor = function(cursor) {
        this._params.cursor = cursor;
    };

    this._params = {
        x: 160,
        y: 96,
        zoom: 1,
        width: 800,
        height: 600,
        visible: false,
        cursor: 'default'
    };
});