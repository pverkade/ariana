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

        var layer = $scope.renderEngine.layers[currentLayer];
        var x = (layer.getPosX()+1)/2 * canvas.width;
        var y = (-1.*layer.getPosY()+1)/2. * canvas.height;

        var dx = x-mouse.current.x;
        var dy = y+50-mouse.current.y;

        console.log(dx);
        console.log(dy);
        var angle = Math.atan2(dx, dy);
        //console.log(angle);
        layer.setRotation(angle);
        $scope.renderEngine.render();

        /*var oldX = normalize(mouse.old.x);
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
        }*/
    }
};