angular.module('ariana').controller('contentCtrl', function($scope, $window) {
    $scope.mouseMove = function(e) {
        $scope.config.mouse.location.x = e.x;
        $scope.config.mouse.location.y = e.y;
    }

    $scope.mouseClick = function(e) {
        $scope.config.mouse.click.x = e.x;
        $scope.config.mouse.click.y = e.y;
    }
    
    var canvas = document.getElementById('main-canvas');
    var context = canvas.getContext('2d');
    console.log(canvas);
    
    //$scope.renderEngine = new RenderEngine(canvas);   
    //console.log($scope.renderEngine);
});
