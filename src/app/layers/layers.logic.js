angular.module('ariana').controller('layersCtrl', function($scope) {
    $scope.getAllLayers = function() {
        var result = [];

        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            // add if layer is modifiable by user
            result.push($scope.renderEngine.getLayer(i));
        }
    };

    $scope.safeLayerReorder = function (i, j) {
        var num = $scope.config.layers.numberOfLayers;
        if (0 <= i && i < num && 0 <= j && j < num) {
            this.renderEngine.reorder(i, j);
        }
    };
});