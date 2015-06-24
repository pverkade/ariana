app.service('mouse', function() {

    this.getPos = function() {
        return {x: this._params.current.x, y: this._params.current.y};
    };
    
    this.getPosX = function() {
        return this._params.current.x;
    };
    
    this.getPosY = function() {
        return this._params.current.y;
    };

    this.getPosGlobal = function() {
        return {x: this._params.current.global.x, y: this._params.current.global.y};
    };

    this.getPosOld = function() {
        return {x: this._params.old.x, y: this._params.old.y};
    };

    this.getPosOldGlobal = function() {
        return {x: this._params.old.global.x, y: this._params.old.global.y};
    };

    this.getButtons = function() {
        return this._params.button;
    };

    this.getPrimary = function() {
        return this._params.button.primary;
    };

    this.getMiddle = function() {
        return this._params.button.middle;
    };

    this.getSecondary = function() {
        return this._params.button.secondary;
    };

    this.setPos = function(x, y) {
        this._params.current.x = x;
        this._params.current.y = y;
    };

    this.setX = function(x) {
        this._params.current.x = x;
    };

    this.setY = function(y) {
        this._params.current.y = y;
    };
    
    this.setPosX = function(x) {
        this._params.current.x = x;
    };

    this.setPosY = function(y) {
        this._params.current.y = y;
    };

    this.setGlobalPos = function(x, y) {
        this._params.current.global.x = x;
        this._params.current.global.y = y;
    };

    this.setGlobalX = function(x) {
        this._params.current.global.x = x;
    };

    this.setGlobalY = function(y) {
        this._params.current.global.y = y;
    };
    
    this.setGlobalPosX = function(x) {
        this._params.current.global.x = x;
    };

    this.setGlobalPosY = function(y) {
        this._params.current.global.y = y;
    };

    this.setOldPos = function(x, y) {
        this._params.old.x = x;
        this._params.old.y = y;
    };

    this.setOldX = function(x) {
        this._params.old.x = x;
    };

    this.setOldY = function(y) {
        this._params.old.y = y;
    };
    
    this.setOldPosX = function(x) {
        this._params.old.x = x;
    };

    this.setOldPosY = function(y) {
        this._params.old.y = y;
    };

    this.setOldGlobalPos = function(x, y) {
        this._params.old.global.x = x;
        this._params.old.global.y = y;
    };

    this.setOldGlobalX = function(x) {
        this._params.old.global.x = x;
    };

    this.setOldGlobalY = function(y) {
        this._params.old.global.y = y;
    };
    
    this.setOldGlobalPosX = function(x) {
        this._params.old.global.x = x;
    };

    this.setOldGlobalPosY = function(y) {
        this._params.old.global.y = y;
    };

    this.setPrimary = function(state) {
        this._params.button.primary = state;
    };

    this.setMiddle = function(state) {
        this._params.button.middle = state;
    };

    this.setSecondary = function(state) {
        this._params.button.secondary = state;
    };
    
    this.checkActive = function() {
        return (this._params.button.primary || this._params.button.middle);
    };

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
            primary: false, // left button
            middle: false, // middle button
            secondary: false // right button
        }
    };
});