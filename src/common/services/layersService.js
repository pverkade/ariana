app.service('layers', function() {

    this.getNumCreatedLayers = function() {
        return this._params.numberOfLayersCreated;
    };

    this.getNumLayers = function() {
        return this._params.numberOfLayers;
    };

    this.getCurrentIndex = function() {
        return this._params.currentLayer;
    };

    this.getLayers = function() {
        return this._params.layerInfo;
    };
    
    this.getLayerInfo = function() {
        return this._params.layerInfo;
    };

    this.setNumCreatedLayers = function(i) {
        this._params.numberOfLayersCreated = i;
    };

    this.setNumLayers = function(i) {
        this._params.numberOfLayers = i;
    };

    this.setCurrentIndex = function(i) {
        this._params.currentLayer = i;
    };
    
    this.setLayerInfo = function(array) {
        this._params.layerInfo = array;
    };

    this.setLayerData = function(index, data) {
        this._params.layerInfo[index] = data;
    };

    this.overwriteLayers = function(data) {
        this._params.layerInfo = data;
    };

    this._params = {
        numberOfLayersCreated: 0,
        numberOfLayers: 0,
        currentLayer: -1,
        layerInfo: []
    };
});