angular.module('ariana').controller('contentCtrl', function($scope, $window) {

    $scope.position       = {"x": 0, "y": 0};
    $scope.lastPosition   = {"x": 0, "y": 0};
    
    /* This function pans over the image. */
    $scope.pan = function() {
        var x = $scope.config.mouse.location.x;
        var y = $scope.config.mouse.location.y;
        
        var dx = x - $scope.lastPosition.x;
        var dy = y - $scope.lastPosition.y;
            
        $scope.position.x += dx;
        $scope.position.y += dy;

        var currentLayer = $scope.config.layers.currentLayer;
        
        /* Set the position of the top layer. */
        // TODO later: use selected layer
        if (currentLayer >= 0) {
            //FIXME cannot set position without Arnold dissapearing
            $scope.renderEngine.layers[currentLayer].setPos($scope.position.x/1024*2 -1, 1-$scope.position.y/1024*2);
            $scope.renderEngine.render();
        }
        
        $scope.lastPosition.x = x;
        $scope.lastPosition.y = y;
    };

    $scope.mouseMove = function(e) {
        e.preventDefault();
        $scope.config.mouse.location.x = e.pageX;
        $scope.config.mouse.location.y = e.pageY;
        
        /* If the mouse is down, */
        if ($scope.config.mouse.click.down) {
            // TODO only on left button
            if ($scope.config.tools.activeTool == null) $scope.pan();
        };          
    }

    $scope.mouseDown = function(e) {
        e.preventDefault();
        $scope.config.mouse.click.down = true;
        $scope.config.mouse.click.x = e.pageX;
        $scope.config.mouse.click.y = e.pageY;
        
        /* Set the last position for correct panning etc. */
        $scope.lastPosition.x = e.pageX;
        $scope.lastPosition.y = e.pageY;
        
        if ($scope.config.tools.activeTool == null) $("#main-canvas").addClass("cursor-grabbing");
    }
    
    $scope.mouseUp = function(e) {
        e.preventDefault();
        $scope.config.mouse.click.down = false;
        
        if ($scope.config.tools.activeTool == null) $("#main-canvas").removeClass("cursor-grabbing");
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    var image = new Image();
    image.src="/assets/img/arnold2.jpg";
    
    image.onload = function() {
        $scope.newLayerFromImage(image);
        //$scope.renderEngine.render();
    }
});
