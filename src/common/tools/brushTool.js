var brushTool = {
    
    start: function() {
        var scope = angular.element($("#main-canvas")).scope();
        $("#main-canvas").css("cursor", "url(/assets/vectors/brush.svg), auto");
        
        //scope.drawEngine.activate();
        scope.drawEngine.setBrush(brushType.THIN);
        //$scope.drawEngine.setBrush(brushType.THIN);
    },
    
    mouseDown: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");

        $scope.drawEngine.onMousedown(event);
    },
    
    mouseDownRight: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");

        $scope.drawEngine.onContextMenu(event);
    },
    
    mouseUp: function($scope, event) {
        $("#main-canvas").css("cursor", "url(/assets/vectors/brush.svg), auto");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    },
}