var rotateTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#main-canvas").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "grab");
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var rotation = $scope.renderEngine.layers[currentLayer].getRotation();
        $scope.config.layers.layerInfo[currentLayer].rotation = rotation;
    },
    
    mouseMove: function($scope) {

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        // FIXME wrong coordinates
        // FIXME use canvas width and height 
        console.log("X", $scope.config.layers.layerInfo[currentLayer].x, $scope.config.layers.layerInfo[currentLayer].xScale);
        
        var centerX = 1920 * ($scope.config.layers.layerInfo[currentLayer].x + 0.5 * $scope.config.layers.layerInfo[currentLayer].xScale);
        var centerY = 1080 * (1 - ($scope.config.layers.layerInfo[currentLayer].y + 0.5 * $scope.config.layers.layerInfo[currentLayer].yScale));
        
        console.log(centerX, centerY);
        
        var originalDirection = Math.atan2($scope.config.mouse.lastClick.y - centerY, $scope.config.mouse.lastClick.x - centerX); 
        var newDirection      = Math.atan2($scope.config.mouse.current.x   - centerX, $scope.config.mouse.current.x   - centerX); 
    
        console.log("differnece", originalDirection - newDirection);
        
        //$scope.renderEngine.layers[currentLayer].setPos(2 * dx/$scope.renderEngine.width + xOffset, -2 * dy/$scope.renderEngine.height + yOffset);
        //window.requestAnimationFrame(function() {$scope.renderEngine.render();});
    },
}