var rotateTool = {
    
    start: function() {
        $("#background").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#background").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#background").css("cursor", "grab");
    },

    mouseMove: function($scope) {
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) return;
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var layer = $scope.renderEngine.layers[currentLayer]
        
        var x = layer.getPosX();
        var y = layer.getPosY();
        
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        var currentX = $scope.config.mouse.current.x;
        var currentY = $scope.config.mouse.current.y;
        
        var angleOld = Math.atan2(currentY - dy - y, currentX - dx - x);
        var angleCurrent = Math.atan2(currentY - y, currentX - x);
        var rotation = layer.getRotation();
        
        console.log(angleOld, angleCurrent);
        
        $scope.renderEngine.layers[currentLayer].setRotation(rotation + (angleOld - angleCurrent));
        
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});    

    },
};