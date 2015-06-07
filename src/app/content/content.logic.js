angular.module('ariana').controller('contentCtrl', function($scope, $window) {
    
    /* This function pans over the image. */
    $scope.pan = function(translate) {
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;
        console.log("DELTA'" , dx, dy)

        /* Translate: set the position of the selected layer. */
        if (translate) {
            var currentLayer = $scope.config.layers.currentLayer;
            if (currentLayer > -1) {
                var xOffset = $scope.config.layers.layerInfo[currentLayer].x;
                var yOffset = $scope.config.layers.layerInfo[currentLayer].y;
                console.log("GET", xOffset, yOffset);
                
                $scope.renderEngine.layers[currentLayer].setPos(2*dx/1920 + xOffset, -2*dy/1080 + yOffset);
                $scope.renderEngine.render();
            }
        }
        /* Pan: set the position of all layers. */
        else {
            for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                var xOffset = $scope.config.layers.layerInfo[i].x;
                var yOffset = $scope.config.layers.layerInfo[i].y;
                
                $scope.renderEngine.layers[i].setPos(2*dx/1920 + xOffset, -2*dy/1080 + yOffset);
            }
            $scope.renderEngine.render();
        }
    };

    $scope.mouseMove = function(e) {
        e.preventDefault();
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        
        /* If the mouse is down, */
        if ($scope.config.mouse.click.down) {
            // TODO only on left button
            if ($scope.config.tools.activeTool == "pan")        { $scope.pan(false); return; }
            if ($scope.config.tools.activeTool == "translate")  { $scope.pan(true); return; }
            if ($scope.config.tools.activeTool == "scale")      { return; }
            if ($scope.config.tools.activeTool == "rotate")     { return; }
        };          
    }

    $scope.mouseDown = function(e) {
        e.preventDefault();
        $scope.config.mouse.click.down = true;
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        $scope.config.mouse.lastClick.x = e.pageX;
        $scope.config.mouse.lastClick.y = e.pageY;
        
        /* Set cursor. */
        if ($scope.config.tools.activeTool == "pan") $("#main-canvas").css("cursor", "grabbing");
    }
    
    $scope.mouseUp = function(e) {
        e.preventDefault();
        $scope.config.mouse.click.down = false;
        
        /* Reset cursor. */
        if ($scope.config.tools.activeTool == "pan") $("#main-canvas").css("cursor", "grab");
            
        if ($scope.config.tools.activeTool == "pan" || $scope.config.tools.activeTool == "translate") {
            /* Set offset in config */
            for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                var xOffset = $scope.renderEngine.layers[i].getPosX();
                var yOffset = $scope.renderEngine.layers[i].getPosY();
                $scope.config.layers.layerInfo[i].x = xOffset;
                $scope.config.layers.layerInfo[i].y = yOffset;
                console.log("SET", xOffset, yOffset);
            }
        }
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    var image = new Image();
    image.src="/assets/img/arnold2.jpg";
    
    image.onload = function() {
        $scope.newLayerFromImage(image);
        //$scope.renderEngine.render();
    }
    
    var image2 = new Image();
    image2.src="/assets/img/arnold2.jpg";
    
    image2.onload = function() {
        $scope.newLayerFromImage(image2);
        //$scope.renderEngine.render();
    }
});
