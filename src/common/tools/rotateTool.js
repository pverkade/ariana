var rotateTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#main-canvas").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "grab");
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        
        var rotation = $scope.renderEngine.layers[currentLayer].getRotation();
        $scope.config.layers.layerInfo[currentLayer].rotation = rotation;
    },

    mouseMove: function($scope) {

        function normalize(x, c) {
            return 2 * (x / c) - 1;
        }

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var mouse = $scope.config.mouse;
        var canvas = document.getElementById("main-canvas");

        var height = canvas.height;
        var width = canvas.width;

        var oldX = normalize(mouse.old.x, width);
        var oldY = normalize(mouse.old.y, height);

        var newX = normalize(mouse.current.x, width);
        var newY = normalize(mouse.current.y, height);

        var layer = $scope.renderEngine.layers[currentLayer];
        var oldAngle = Math.atan2(oldX - layer.getPosX(), oldY - layer.getPosY());
        var newAngle = Math.atan2(newX - layer.getPosX(), newY - layer.getPosY());

        // FIXME: Why is it so slow
        var deltaAngle = 1.3 * (newAngle - oldAngle);

        console.log(deltaAngle);

        if (deltaAngle) {
            var old = layer.getRotation();
            layer.setRotation(old + deltaAngle);
            $scope.renderEngine.render();
            // FIXME: using request animation fucks things up.
            //requestAnimationFrame($scope.renderEngine.render);
        }
    }
};