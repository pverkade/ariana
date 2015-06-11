var eraserTool = {
    
    start: function() {
        var scope = angular.element($("#background")).scope();
        $("#background").css("cursor", "url(/assets/vectors/eraser.svg), auto");
        
        //scope.drawEngine.activate();
        scope.drawEngine.setDrawType(drawType.ERASE);
        scope.drawEngine.activate(scope);
    },

    end: function() {
        //TODO: erasing doesnt work yet
        var scope = angular.element($("#background")).scope();

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
        console.log("mouseUP");
        console.log(event);
        $("#background").css("cursor", "url(/assets/vectors/eraser.svg), auto");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    },
}