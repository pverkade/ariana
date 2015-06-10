var rotateTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "default");
    },
    
    mouseDown: function($scope) {
    },
    
    mouseUp: function($scope) {
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var xScale = $scope.renderEngine.layers[currentLayer].getScaleX();
        var yScale = $scope.renderEngine.layers[currentLayer].getScaleX();
        
        $scope.config.layers.layerInfo[currentLayer].xScale = xScale;
        $scope.config.layers.layerInfo[currentLayer].yScale = yScale;
    },

    mouseMove: function($scope) {
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var mouse  = $scope.config.mouse;
        var canvas = document.getElementById("main-canvas");
        
        var width  = canvas.width;
        var height = canvas.height;
        

        var layer = $scope.renderEngine.layers[currentLayer];
        
        var x = (layer.getPosX() + 1)/ 2 * canvas.width;
        var y = (-1. * layer.getPosY() + 1)/ 2. * canvas.height;

        var dx = x - mouse.current.x;
        var dy = y + 50 - mouse.current.y;

        console.log(dx);
        console.log(dy);
        var angle = Math.atan2(dx, dy);
        //console.log(angle);
        layer.setRotation(angle);
        $scope.renderEngine.render();
    }
};