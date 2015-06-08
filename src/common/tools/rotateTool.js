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
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var mouse = $scope.config.mouse;
        var canvas = document.getElementById("main-canvas");
        var width = canvas.width;
        var height = canvas.height;
        var ratio = width / height;

        function normalize(x) {
            /* for y it is :
             * 2 * (y / (height * (width / height)) =
             * 2 * (y / height)
             */
            return 2 * (x / width) - 1;
        }

        var oldX = normalize(mouse.old.x);
        var oldY = normalize(mouse.old.y);

        var newX = normalize(mouse.current.x);
        var newY = normalize(mouse.current.y);

        var layer = $scope.renderEngine.layers[currentLayer];
        var oldAngle = Math.atan2(oldX - layer.getPosX(), oldY - layer.getPosY());
        var newAngle = Math.atan2(newX - layer.getPosX(), newY - layer.getPosY());

        var deltaAngle = (newAngle - oldAngle);

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