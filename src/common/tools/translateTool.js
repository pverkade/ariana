var translateTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "move");
    },
    
    mouseDown: function($scope) {
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
        // only when mouse is up
        if ($scope.config.mouse.click.down == false) return;
        
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var xOffset = $scope.config.layers.layerInfo[currentLayer].x;
        var yOffset = $scope.config.layers.layerInfo[currentLayer].y;
        
        $scope.renderEngine.layers[currentLayer].setPos(2 * dx/$scope.renderEngine.width + xOffset, -2 * dy/$scope.renderEngine.height + yOffset);
        $scope.renderEngine.render();
        
    },
}