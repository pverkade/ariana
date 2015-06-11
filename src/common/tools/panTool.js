var panTool = {
    
    start: function() {
        $("#background").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#background").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) $("#background").css("cursor", "grab");
    },
    
    mouseMove: function($scope) {
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) return;
        
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;

        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        $scope.config.canvas.x += dx;
        $scope.config.canvas.y += dy;
        
        $("#main-canvas").css("transform", "translate(" + $scope.config.canvas.x + "px, " + $scope.config.canvas.y + "px)");
    },
};

