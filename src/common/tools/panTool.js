var panTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#main-canvas").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "grab");
        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            var xOffset = $scope.renderEngine.layers[i].getPosX();
            var yOffset = $scope.renderEngine.layers[i].getPosY();
            $scope.config.layers.layerInfo[i].x = xOffset;
            $scope.config.layers.layerInfo[i].y = yOffset;
        }
    },
    
    mouseMove: function($scope) {
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;

        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            var xOffset = $scope.config.layers.layerInfo[i].x;
            var yOffset = $scope.config.layers.layerInfo[i].y;
            
            $scope.renderEngine.layers[i].setPos(2 * dx/$scope.renderEngine.width + xOffset, -2 * dy/$scope.renderEngine.height + yOffset);
        }
        
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});
    },
}