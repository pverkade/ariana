app.service('colors', function() {

    this.getPrimary = function() {
        return this._params.primary;
    };

    this.getPrimaryR = function() {
        return this._params.primary.r;
    };

    this.getPrimaryG = function() {
        return this._params.primary.g;
    };

    this.getPrimaryB = function() {
        return this._params.primary.b;
    };

    this.getSecondary = function() {
        return this._params.secondary;
    };

    this.getSecondaryR = function() {
        return this._params.secondary.r;
    };

    this.getSecondaryG = function() {
        return this._params.secondary.g;
    };
    
    this.getSecondaryB = function() {
        return this._params.secondary.b;
    };

    this.setPrimary = function(r, g, b) {
        this._params.primary.r = r;
        this._params.primary.g = g;
        this._params.primary.b = b;
    };

    this.setPrimaryR = function(r) {
        this._params.primary.r = r;
    };

    this.setPrimaryG = function(g) {
        this._params.primary.g = g;
    };

    this.setPrimaryB = function(b) {
        this._params.primary.b = b;
    };

    this.setPrimaryRgb = function(rgb) {
        this._params.primary.r = rgb.r;
        this._params.primary.g = rgb.g;
        this._params.primary.b = rgb.b;
    };
    
    this.setSecondary = function(r, g, b) {
        this._params.secondary.r = r;
        this._params.secondary.g = g;
        this._params.secondary.b = b;
    };

    this.setSecondaryR = function(r) {
        this._params.secondary.r = r;
    };

    this.setSecondaryG = function(g) {
        this._params.secondary.g = g;
    };

    this.setSecondaryB = function(b) {
        this._params.secondary.b = b;
    };

    this.setSecondaryRgb = function(rgb) {
        this._params.secondary.r = rgb.r;
        this._params.secondary.g = rgb.g;
        this._params.secondary.b = rgb.b;
    };

    this._params = {
        primary: {
            r: 0,
            g: 0,
            b: 0
        },
        secondary: {
            r: 255,
            g: 255,
            b: 255
        }
    };
});