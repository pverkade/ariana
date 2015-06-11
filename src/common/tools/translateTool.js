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

        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var currentX = $scope.renderEngine.layers[currentLayer].getPosX();
        var currentY = $scope.renderEngine.layers[currentLayer].getPosY();

        $scope.renderEngine.layers[currentLayer].setPos(currentX + dx, currentY + dy);
        
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});    
    },
};