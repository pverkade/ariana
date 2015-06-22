/* 
 * Project Ariana
 * layers.logic.js
 * 
 * This file contains the LayersController, which controls the Layer Selector
 * element.
 *
 */
 
app.controller('layersCtrl', function($scope) {
    
    /* This functions returns whether the toolbox should be visible. It is 
     * hidden when the user is clicking on the canvas/background. */
    $scope.checkVisible = function() {
        return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
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

        $scope.renderEngine.render();
    };
    
    $scope.isHidden = function(index) {
        return $scope.renderEngine.getLayer(index).isHidden();
    };

    $scope.addLayer = function(event) {
        //event.stopPropagation();
        $scope.config.layers.numberOfLayers = $scope.renderEngine.getNumberOfLayers();
    };

    $scope.removeLayer = function(event, index) {
        event.stopPropagation();
        $scope.config.layers.layerInfo.splice(index, 1);
        $scope.config.layers.numberOfLayers = $scope.renderEngine.getNumberOfLayers();
        
        if ($scope.config.layers.currentLayer == $scope.renderEngine.getNumberOfLayers())
            $scope.config.layers.currentLayer -= 1;
        
        $scope.renderEngine.removeLayer(index);
        $scope.editEngine.clear();

        window.requestAnimationFrame(function () {
            $scope.renderEngine.render();
        });
    };

    $scope.moveLayerUp = function(event, index) {
        event.stopPropagation();

        if (index < $scope.renderEngine.getNumberOfLayers() - 1 && $scope.renderEngine.getNumberOfLayers() > 1) {
            $scope.renderEngine.reorder(index, index + 1);
            $scope.renderEngine.render();
        }
    };

    $scope.moveLayerDown = function(event, index) {
        event.stopPropagation();

        if (index > 0) {
            $scope.renderEngine.reorder(index, index - 1);
            $scope.renderEngine.render();
        }

    };

    /* This function selects a specific layer if possible. */
    $scope.selectLayer = function(newIndex) {
        if (0 <= newIndex && newIndex < $scope.renderEngine.getNumberOfLayers()) {
            $scope.setCurrentLayerIndex(newIndex);
            return true;
        }
        return false;
    };

    $scope.getThumbnail = function(index) {
        var thumbnail =  $scope.renderEngine.getLayer(index).getThumbnail();

        return thumbnail;
    };

    $scope.getLayersIndices = function() {
        var indices = [];
        for (var i = 0; i < $scope.renderEngine.getNumberOfLayers(); i++) {
            indices.unshift(i);
        }
        //return $scope.config.layers.layerInfo.slice().reverse();
        return indices;
    }
});