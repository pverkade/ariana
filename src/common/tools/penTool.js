var penTool = {
    
    start: function() {
        var scope = angular.element($("#main-canvas")).scope();
        $("#main-canvas").css("cursor", "url(/assets/vectors/pen.svg), auto");
        
        //scope.drawEngine.activate();
        scope.drawEngine.setDrawType(drawType.NORMAL);
        scope.drawEngine.activate();
        //$scope.drawEngine.setBrush(brushType.THIN);
    },

    stop: function() {
        var scope = angular.element($("#main-canvas")).scope();

        var image = new Image();
        image.onload = function() { scope.newLayerFromDrawing(image); }
        image.src = scope.drawEngine.getCanvasImageData();

        scope.drawEngine.deactivate();
    },
    
    mouseDown: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");

        $scope.drawEngine.onMousedown(event);
    },
    
    mouseDownRight: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");

        $scope.drawEngine.onContextmenu(event);
    },
    
    mouseUp: function($scope, event) {
        $("#main-canvas").css("cursor", "url(/assets/vectors/pen.svg), auto");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    },
}