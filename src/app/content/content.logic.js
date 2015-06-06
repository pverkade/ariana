angular.module('ariana').controller('contentCtrl', function($scope, $window) {
    $scope.mouseMove = function(e) {
        $scope.config.mouse.location.x = e.x;
        $scope.config.mouse.location.y = e.y;
    }

    $scope.mouseClick = function(e) {
        $scope.config.mouse.click.x = e.x;
        $scope.config.mouse.click.y = e.y;
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    var image = new Image();
    image.src="/assets/img/arnold2.jpg";
    
    image.onload = function() {
        $scope.newLayerFromImage(this);
    }
    
});
