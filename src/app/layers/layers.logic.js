angular.module('ariana').controller('layersCtrl', function($scope) {
    /* Some mock layers */
    $scope.layers = {
        1: {
            visible: true
        },
        2: {
            visible: true
        },
        3: {
            visible: true
        }
    };

    /* Toggles visibility of layers */
    $scope.toggleVisible = function(layer) {
        var selected = $scope.layers[layer];
        selected.visible = !selected.visible;
    }
});