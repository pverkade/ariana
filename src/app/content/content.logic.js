angular.module('ariana').controller('contentCtrl', function($scope, $window) {

    this.position       = {"x": 0, "y": 0};
    this.lastPosition   = {"x": 0, "y": 0};
    
    /* This function pans over the image. */
    $scope.pan = function() {
        var x = $scope.config.mouse.location.x;
        var y = $scope.config.mouse.location.y;
    
        var dx = this.lastPosition.x - x;
        var dy = this.lastPosition.y - y;
            
        this.position.x += dx;
        this.position.y += dy;
            
        // TODO renderEngine set layer position
        console.log("PAN", x, y);
        
        this.lastPosition.x = x;
        this.lastPosition.y = y;
    };

    $scope.mouseMove = function(event) {
        event.preventDefault();
        
        $scope.config.mouse.location.x = event.x;
        $scope.config.mouse.location.y = event.y;
        
        /* If the mouse is down, */
        if ($scope.config.mouse.click.down) {
            // TODO only on left button
            //if ($scope.config.tools.activeTool == null) $scope.pan();
        };          
    }

    $scope.mouseDown = function(event) {
        event.preventDefault();
        $scope.config.mouse.click.down = true;
        $scope.config.mouse.click.x = event.x;
        $scope.config.mouse.click.y = event.y;
    }
    
    $scope.mouseUp = function(event) {
        event.preventDefault();
        $scope.config.mouse.click.down = false;
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
