var scaleToolIndex = 0;

var scaleTool = {
    
    start: function() {
        //$("#background").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        //$("#background").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        //$("#background").css("cursor", "grab");
    },
    
    mouseMove: function($scope) {
        
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
         
        var layer = $scope.renderEngine.layers[currentLayer];
               
        var mouseCurrentX = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var mouseCurrentY = $scope.config.mouse.current.y - $scope.config.canvas.y; 
        var x = layer.getPosX();
        var y = layer.getPosY();
     
        var angle = (Math.atan2(y - mouseCurrentY, mouseCurrentX - x) + 2 * Math.PI) % (2 * Math.PI);
        var distance = Math.sqrt(Math.pow(y - mouseCurrentY, 2) + Math.pow(mouseCurrentX - x, 2));
        
        var differenceX = mouseCurrentX - x;
        var differenceY = y - mouseCurrentY;
              
        /* Update the index and the cursor. */
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) {
            
            var ratio = Math.abs(differenceY) / Math.abs(differenceX);
            var layerRatio = layer.getHeight() / layer.getWidth(); 
            
            
            scaleToolIndex = Math.round(8 * (angle / (2 * Math.PI)));
            
            if (scaleToolIndex == 0) {$("#background").css("cursor", "e-resize"); };
            if (scaleToolIndex == 1) { $("#background").css("cursor", "ne-resize"); };
            if (scaleToolIndex == 2) { $("#background").css("cursor", "n-resize"); };
            if (scaleToolIndex == 3) { $("#background").css("cursor", "nw-resize"); };
            if (scaleToolIndex == 4) { $("#background").css("cursor", "w-resize"); };
            if (scaleToolIndex == 5) { $("#background").css("cursor", "sw-resize"); };
            if (scaleToolIndex == 6) { $("#background").css("cursor", "s-resize"); };
            if (scaleToolIndex == 7) { $("#background").css("cursor", "se-resize"); };
            if (scaleToolIndex == 8) { $("#background").css("cursor", "e-resize"); scaleToolIndex = 0; };
            return;
        }
        
        console.log(scaleToolIndex);
        
        var mouseOldX = $scope.config.mouse.old.x - $scope.config.canvas.x;
        var mouseOldY = $scope.config.mouse.old.y - $scope.config.canvas.y; 
        
        var distanceOld = Math.sqrt(Math.pow(mouseOldY - y, 2) + Math.pow(mouseOldX - x, 2));
        
        /* Update old mouse. */
        $scope.config.mouse.old.x = $scope.config.mouse.current.x;
        $scope.config.mouse.old.y = $scope.config.mouse.current.y;
        
        /* Scale width and height */
        var scale = 0.5 + 0.5 * (distance / distanceOld);
        
        if (scaleToolIndex != 2 && scaleToolIndex != 6) {
            var width  = layer.getWidth();
            $scope.renderEngine.layers[currentLayer].setWidth(width * scale);
        }
        
        if (scaleToolIndex != 0 && scaleToolIndex != 4) {
            var height = layer.getHeight();
            $scope.renderEngine.layers[currentLayer].setHeight(height * scale);
        }
        
        if (scaleToolIndex == 7 || scaleToolIndex == 0 || scaleToolIndex == 1) 
            x += 0.5 * ((scale * width) - width);
        
        if (scaleToolIndex == 3 || scaleToolIndex == 4 || scaleToolIndex == 5) 
            x -= 0.5 * ((scale * width) - width);
        
        if (scaleToolIndex == 5 || scaleToolIndex == 6 || scaleToolIndex == 7) 
            y += 0.5 * ((scale * height) - height);
        
        if (scaleToolIndex == 1 || scaleToolIndex == 2 || scaleToolIndex == 3) 
            y -= 0.5 * ((scale * height) - height);
        
        layer.setPos(x, y);
        
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});  
    },
};