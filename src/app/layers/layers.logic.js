angular.module('ariana').controller('layersCtrl', function($scope) {
    
    /* This functions returns whether the toolbox should be visible. It is 
     * hidden when the user is clicking on the canvas/background. */
    $scope.checkVisible = function() {
        return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
    };
    
    $scope.addLayer = function() {
        event.stopPropagation();
        
        $scope.config.layers.layerInfo.push({
            "name": $scope.config.layers.currentLayer,
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
    };

    $scope.moveLayerUp = function(event, index) {
        event.stopPropagation();
        console.log(index);

        if (index > 0) {
            $scope.config.layers.layerInfo.swap(index, index - 1);
        }
    };

    $scope.moveLayerDown = function(event, index) {
        event.stopPropagation();
        console.log(index);

        if (index < $scope.config.layers.numberOfLayers - 1 && $scope.config.layers.numberOfLayers > 1) {
            $scope.config.layers.layerInfo.swap(index, index + 1);
        }
    };

    /* This function selects a specific layer if possible. */
    $scope.selectLayer = function(newIndex) {
        if (0 <= newIndex && newIndex < $scope.config.layers.numberOfLayers) {
            $scope.config.layers.currentLayer = newIndex;
            return true;
        }
        return false;
    };
});