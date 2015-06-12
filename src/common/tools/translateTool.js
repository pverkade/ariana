var translateTool = {

    start: function() {
        $("#background").css("cursor", "move");
    },

    mouseDown: function($scope) {
    },

    mouseUp: function($scope) {
    },

    mouseMove: function($scope) {
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) return;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var layer = $scope.renderEngine.layers[currentLayer];
        
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        
        /* Update th old mouse position. */
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        /* Get the layer position. */
        var x = layer.getPosX();
        var y = layer.getPosY();

        layer.setPos(x + dx, y + dy);
        console.log("Edit engine draw translate tool");
        $scope.editEngine.drawTranslateTool(layer);
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});    
    },
};