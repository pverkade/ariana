app.service('mouse', function() {

    this.getPos = function() {
        return {x: this._params.current.x, y: this._params.current.y};
    }

    this.getPosGlobal = function() {
        return {x: this._params.current.global.x, y: this._params.current.global.y};
    }

    this.getPosOld = function() {
        return {x: this._params.old.x, y: this._params.old.y};
    }

    this.getPosOldGlobal = function() {
        return {x: this._params.old.global.x, y: this._params.old.global.y};
    }

    this.getButtons = function() {
        return this._params.button;
    }

    this.getPrimary = function() {
        return this._params.button.1;
    }

    this.getMiddle = function() {
        return this._params.button.2;
    }

    this.getSecondary = function() {
        return this._params.button.3;
    }

    this.setPos = function(x, y) {
        this._params.current.x = x;
        this._params.current.y = y;
    }

    this.setX = function(x) {
        this._params.current.x = x;
    }

    this.setY = function(y) {
        this._params.current.y = y;
    }

    this.setGlobalPos = function(x, y) {
        this._params.current.global.x = x;
        this._params.current.global.y = y;
    }

    this.setGlobalX = function(x) {
        this._params.current.global.x = x;
    }

    this.setGlobalY = function(y) {
        this._params.current.global.y = y;
    }

    this.setOldPos = function(x, y) {
        this._params.old.x = x;
        this._params.old.y = y;
    }

    this.setOldX = function(x) {
        this._params.old.x = x;
    }

    this.setOldY = function(y) {
        this._params.old.y = y;
    }

    this.setOldGlobalPos = function(x, y) {
        this._params.old.global.x = x;
        this._params.old.global.y = y;
    }

    this.setOldGlobalX = function(x) {
        this._params.old.global.x = x;
    }

    this.setOldGlobalY = function(y) {
        this._params.old.global.y = y;
    }

    this.setPrimary = function(state) {
        this._params.button.1 = state;
    }

    this.setMiddle = function(state) {
        this._params.button.2 = state;
    }

    this.setSecondary = function(state) {
        this._params.button.3 = state;
    }

    this._params = {
        current: {
            x: 0,
            y: 0,
            global: {
                x : 0,
                y : 0
            }
        },
        old: {
            x : 0,
            y : 0,
            global: {
                x : 0,
                y : 0
            }
        },
        button: {
            1: false, // left button
            2: false, // middle button
            3: false // right button
        }
    }
});