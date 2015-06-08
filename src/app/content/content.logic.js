angular.module('ariana').controller('contentCtrl', function($scope, $window) {
    
    $scope.rotate = function() {
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        // FIXME wrong cordinates
        var centerX = 1920 * ($scope.config.layers.layerInfo[currentLayer].x + 0.5 * $scope.config.layers.layerInfo[currentLayer].xScale);
        var centerY = 1080 * (1 - ($scope.config.layers.layerInfo[currentLayer].y + 0.5 * $scope.config.layers.layerInfo[currentLayer].yScale));
        
        console.log(centerX, centerY);
        
        var originalDirection = math.atan2($scope.config.mouse.lastClick.y - centerY, $scope.config.mouse.lastClick.x - centerX); 
        var newDirection = math.atan2($scope.config.mouse.current.x - centerX, $scope.config.mouse.current.x - centerX); 
    
        console.log("directions", originalDirection, newDirection);
    };

    $scope.mouseMove = function(e) {
        e.preventDefault();
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions && $scope.config.mouse.click.down) toolFunctions.mouseMove($scope);      
    }

    $scope.mouseDown = function(e) {
        e.preventDefault();
        /* Set correct position in config. */
        $scope.config.mouse.click.down = true;
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        $scope.config.mouse.lastClick.x = e.pageX;
        $scope.config.mouse.lastClick.y = e.pageY;
        
        /* Start current toolset. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) {
                toolFunctions.mouseDown($scope);
                console.log("HOE HOE");
        }
    }
    
    $scope.mouseUp = function(event) {
        event.preventDefault();
        $scope.config.mouse.click.down = false;
        
        /* End current toolset. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp($scope);
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/arnold2.jpg";
    
    image1.onload = function() {
        $scope.newLayerFromImage(image1);
    }
    
    // Add Arnold the Second
    var image2 = new Image();
    image2.src="/assets/img/moustache.png";
    
    image2.onload = function() {
        $scope.newLayerFromImage(image2);
    }
});
