var translateTool = {
    
    start: function() {
        $("#background").css("cursor", "move");
    },
    
    mouseDown: function($scope) {
    },
    
    mouseUp: function($scope) {
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var xOffset = $scope.renderEngine.layers[currentLayer].getPosX();
        var yOffset = $scope.renderEngine.layers[currentLayer].getPosY();
        $scope.config.layers.layerInfo[currentLayer].x = xOffset;
        $scope.config.layers.layerInfo[currentLayer].y = yOffset;
    },
    
    mouseMove: function($scope) {

        if ($scope.config.mouse.click.down == false) return;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;
        
        var xOffset = $scope.config.layers.layerInfo[currentLayer].x;
        var yOffset = $scope.config.layers.layerInfo[currentLayer].y;

        var width = $scope.renderEngine.width;
        var height = $scope.renderEngine.height;
        var aspectRatio = width/ height;

        $scope.renderEngine.layers[currentLayer].setPos(2 * (dx/width) + xOffset, -2 * (dy/height/aspectRatio) + yOffset);
        $scope.renderEngine.render();
    },
}