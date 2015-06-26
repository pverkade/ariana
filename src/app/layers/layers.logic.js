/* 
 * Project Ariana
 * layers.logic.js
 * 
 * This file contains the LayersController, which controls the Layer Selector
 * element.
 *
 */
 
app.controller('layersCtrl', ['$scope', '$animate', 'mouse', 'layers', 
    function($scope, $animate, mouse, layers) {

    $scope.checkVisible = function() {
        return !mouse.checkActive();
    };
    
    $scope.hidden = false;
    
    $scope.showLayers = function() {
        $scope.hidden = false;
    };
    
    $scope.hideLayers = function() {
        $scope.hidden = true;
    };

    $scope.hideLayer = function(event, index) {
        event.stopPropagation();
        var layer = $scope.renderEngine.getLayer(index);
        layer.setHidden(!layer.isHidden());

        $scope.requestRenderEngineUpdate();
    };
    
    $scope.isHidden = function(index) {
        return $scope.renderEngine.getLayer(index).isHidden();
    };

    $scope.setLayerName = function(index, name) {
        $scope.renderEngine.getLayer(index).setName(name);
    };

    var allLayersIndex = 0;
    
    $scope.addLayer = function() {
        $scope.setNumberOfLayers = $scope.renderEngine.getNumberOfLayers();
        $scope.names.push('Layer ' + (allLayersIndex++ + 1));
    };

    $scope.removeLayer = function(event, index) {
        event.stopPropagation();

        layers.overwriteLayers(layers.getLayerInfo().splice(index, 1));
        layers.setNumberOfLayers = $scope.renderEngine.getNumberOfLayers();

        $scope.renderEngine.removeLayer(index);
        $scope.setCurrentLayerIndex(Math.max(0, index - 1));
        
        $scope.requestRenderEngineUpdate();
    };

    $scope.moveLayerUp = function(event, index) {
        event.stopPropagation();

        if (index < $scope.renderEngine.getNumberOfLayers() - 1 && $scope.renderEngine.getNumberOfLayers() > 1) {
            $scope.renderEngine.reorder(index, index + 1);
            $scope.requestRenderEngineUpdate();
            layers.overwriteLayers(layers.getLayerInfo().swap(index, index + 1));
        }
    };

    $scope.moveLayerDown = function(event, index) {
        event.stopPropagation();

        if (index > 0) {
            $scope.renderEngine.reorder(index, index - 1);
            $scope.requestRenderEngineUpdate();
            layers.overwriteLayers(layers.getLayerInfo().swap(index, index - 1));
        }
    };

    /* This function selects a specific layer if possible. */
    $scope.selectLayer = function(newIndex) {
        if (0 <= newIndex && newIndex < $scope.renderEngine.getNumberOfLayers()) {
            layers.setCurrentIndex(newIndex);
            $scope.setCurrentLayerIndex(newIndex);
        }
    };

    $scope.getThumbnail = function(index) {
        return $scope.renderEngine.getLayer(index).getThumbnail();
    };

    $scope.getLayersIndices = function() {
        var indices = [];
        for (var i = 0; i < $scope.renderEngine.getNumberOfLayers(); i++) {
            indices.unshift(i);
        }

        return indices;
    };
    
    $scope.getCurrentLayerIndex = function() {
        return layers.getCurrentIndex();
    };
    
    $scope.getlayerName = function(index) {
        return layers.getLayerInfo()[index].name;
    };
}]);