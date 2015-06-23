/* 
 * Project Ariana
 * layers.logic.js
 * 
 * This file contains the LayersController, which controls the Layer Selector
 * element.
 *
 */
 
app.controller('layersCtrl', ['$scope', '$animate', function($scope, $animate) {

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

    $scope.setLayerName = function(index, name) {
        $scope.renderEngine.getLayer(index).setName(name)
    };

    var allLayersIndex = 0;
    $scope.addLayer = function(event) {
        //event.stopPropagation();
        $scope.config.layers.numberOfLayers = $scope.renderEngine.getNumberOfLayers();
        $scope.names.push('Layer ' + (allLayersIndex++ + 1));
    };

    $scope.removeLayer = function(event, index) {
        event.stopPropagation();

        $scope.config.layers.layerInfo.splice(index, 1);
        $scope.config.layers.numberOfLayers = $scope.renderEngine.getNumberOfLayers();

        if ($scope.config.layers.currentLayer == $scope.renderEngine.getNumberOfLayers())
            $scope.config.layers.currentLayer -= 1;

        $scope.renderEngine.removeLayer(index);

        $scope.editEngine.clear();
        $scope.requestRenderEngineUpdate();
    };

    $scope.isToBeRemoved = function(index) {
        return $scope.config.layers.layerInfo[index].remove;
    };

    $scope.moveLayerUp = function(event, index) {
        event.stopPropagation();

        if (index < $scope.renderEngine.getNumberOfLayers() - 1 && $scope.renderEngine.getNumberOfLayers() > 1) {
            $scope.renderEngine.reorder(index, index + 1);
            $scope.renderEngine.render();

            swap($scope.config.layers.layerInfo, index, index + 1);
        }

    };

    function swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    $scope.moveLayerDown = function(event, index) {
        event.stopPropagation();

        if (index > 0) {
            $scope.renderEngine.reorder(index, index - 1);
            $scope.renderEngine.render();
            swap($scope.config.layers.layerInfo, index, index - 1);
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
        return $scope.renderEngine.getLayer(index).getThumbnail();
    };

    $scope.getLayersIndices = function() {
        var indices = [];
        for (var i = 0; i < $scope.renderEngine.getNumberOfLayers(); i++) {
            indices.unshift(i);
        }

        return indices;
    };
}]);