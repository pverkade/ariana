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
    console.log(canvas);
    
    // FIXME cannot create renderEngine
    //$scope.renderEngine = new RenderEngine(canvas);   
    //console.log($scope.renderEngine);
});
