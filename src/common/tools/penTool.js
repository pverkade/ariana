var penTool = {
    start: function() {
        var scope = angular.element($("#background")).scope();
        $("#background").css("cursor", "url(/assets/vectors/pen.svg), auto");
        
        //scope.drawEngine.activate();
        scope.drawEngine.setDrawType(drawType.NORMAL);
        scope.drawEngine.clear();
        //scope.drawEngine.activate(scope);
        //$scope.drawEngine.setBrush(brushType.THIN);
    },

    stop: function() {
        var scope = angular.element($("#background")).scope();

        var image = new Image();
        image.onload = function() { scope.newLayerFromDrawing(image); }
        image.src = scope.drawEngine.getCanvasImageData();

        //scope.drawEngine.deactivate();
    },
    
    mouseDown: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");
        console.log("Pen tool mouse down");
        $scope.drawEngine.onMousedown(event);
    },
    
    mouseDownRight: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");
        console.log("Pen tool right mouse down");
        $scope.drawEngine.onContextmenu(event);
    },
    
    mouseUp: function($scope, event) {
        $("#background").css("cursor", "url(/assets/vectors/pen.svg), auto");
        console.log("Pen tool mouse up");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        console.log("Pen tool mouse move");
        $scope.drawEngine.onMousemove(event);
    }
}