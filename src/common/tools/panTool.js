var panTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#main-canvas").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseMove: function($scope) {
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        var indices = [];

        var width = $scope.renderEngine.width;
        var height = $scope.renderEngine.height;
        var aspectRatio = width/ height;

        function normalize(x) {
            return 2 * (x / width) - 1;
        }

        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            var layer = $scope.renderEngine.getLayer(i);
            var xOffset = layer.getPosX();
            var yOffset = layer.getPosY();

            layer.setPos(2 * (dx/width) + xOffset, -2 * (dy/height/aspectRatio) + yOffset);
        }
        
        $scope.renderEngine.render();
    }
};