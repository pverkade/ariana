var brushTool = {
    
    start: function() {
        var scope = angular.element($("#background")).scope();
        $("#background").css("cursor", "url(/assets/vectors/brush.svg), auto");
        
        //scope.drawEngine.activate();
        scope.drawEngine.setBrush(brushType.THIN);
        //scope.drawEngine.activate(scope);
        //$scope.drawEngine.setBrush(brushType.THIN);
    },

    stop: function() {
        var scope = angular.element($("#background")).scope();

        /*var image = new Image();
        image.onload = function() { scope.newLayerFromDrawing(image); }
        image.src = scope.drawEngine.getCanvasImageData();

        scope.drawEngine.deactivate();*/
        scope.drawEngine.clearCanvases();
    },
    
    mouseDown: function($scope, event) {
        //$("#background").css("cursor", "grabbing");
        //TODO: check in de scope of het de rechtermuisknop is
        $scope.drawEngine.onMousedown(event);
    },
    
    mouseDownRight: function($scope, event) {
        //$("#background").css("cursor", "grabbing");

        $scope.drawEngine.onContextmenu(event);
    },
    
    mouseUp: function($scope, event) {
        $("#background").css("cursor", "url(/assets/vectors/brush.svg), auto");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    },
}