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
    }
    
    $scope.hideLayers = function() {
        $scope.hidden = true;
    }

    $scope.hideLayer = function(event, index) {
        event.stopPropagation();
        var layer = $scope.renderEngine.getLayer(index);
        layer.setHidden(!layer.isHidden());
        $scope.config.layers.layerInfo[index].hidden = layer.isHidden();

        $scope.renderEngine.render();
    }
    
    $scope.isHidden = function(index) {
        return $scope.config.layers.layerInfo[index].hidden;
    }

    $scope.addLayer = function(event) {
        //event.stopPropagation();
        
        $scope.config.layers.layerInfo.push({
            "name": 'Layer ' + $scope.config.layers.numberOfLayers,
            "x": 0,
            "y": 0,
            "xScale": 1,
            "yScale": 1,
            "rotation": 0
        });

        $scope.config.layers.numberOfLayers = $scope.config.layers.layerInfo.length;
    };

    $scope.removeLayer = function(event, index) {
        event.stopPropagation();
        $scope.config.layers.layerInfo.splice(index, 1);
        $scope.config.layers.numberOfLayers = $scope.config.layers.layerInfo.length;
        
        if ($scope.config.layers.currentLayer == $scope.config.layers.numberOfLayers)
            $scope.config.layers.currentLayer -= 1;
        
        $scope.renderEngine.removeLayer(index);

        $scope.renderEngine.render();
    };

    $scope.moveLayerUp = function(event, index) {
        event.stopPropagation();
        console.log(index);

        if (index > 0) {
            $scope.config.layers.layerInfo.swap(index, index - 1);
            $scope.renderEngine.reorder(index, index - 1);

            $scope.renderEngine.render();
        }
    };

    $scope.moveLayerDown = function(event, index) {
        event.stopPropagation();
        console.log(index);

        if (index < $scope.config.layers.numberOfLayers - 1 && $scope.config.layers.numberOfLayers > 1) {
            $scope.config.layers.layerInfo.swap(index, index + 1);
            $scope.renderEngine.reorder(index, index + 1);

            $scope.renderEngine.render();
        }
    };

    /* This function selects a specific layer if possible. */
    $scope.selectLayer = function(newIndex) {
        if (0 <= newIndex && newIndex < $scope.config.layers.numberOfLayers) {
            $scope.setCurrentLayerIndex(newIndex);
            return true;
        }
        return false;
    };

    $scope.getThumbnail = function(index) {
        return $scope.renderEngine.getLayer(index).getThumbnail();
    };

});