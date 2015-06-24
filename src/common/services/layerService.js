app.service('layer', function() {

    this.getNumCreatedLayers = function() {
        return this._params.numberOfLayersCreated;
    }

    this.getNumLayers = function() {
        return this._params.numberOfLayers;
    }

    this.getCurrentIndex = function() {
        return this._params.currentLayer;
    }

    this.getLayers = function() {
        return this._params.layerInfo;
    }

    this._params = {
        numberOfLayersCreated: 0,
        numberOfLayers: 0,
        currentLayer: -1,
        layerInfo: []
    }
});