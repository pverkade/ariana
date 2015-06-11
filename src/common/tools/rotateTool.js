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
        
        var mouseCurrentX = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var mouseCurrentY = $scope.config.mouse.current.y - $scope.config.canvas.y;
        
        var mouseOldX = $scope.config.mouse.old.x - $scope.config.canvas.x;
        var mouseOldY = $scope.config.mouse.old.y - $scope.config.canvas.y;
        
        var dx = mouseCurrentX - mouseOldX;
        var dy = mouseCurrentY - mouseOldY;
        
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        
        var angleOld     = Math.atan2(mouseOldY - y, mouseOldX - x);
        var angleCurrent = Math.atan2(mouseCurrentY - y, mouseCurrentX - x);
        
        var difference = (angleOld - angleCurrent);
        console.log(difference);
        
        console.log(angleOld, angleCurrent);
        
        var rotation = layer.getRotation();
        
        $scope.renderEngine.layers[currentLayer].setRotation(rotation + difference);
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});    

    },
};