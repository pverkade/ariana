var scaleToolIndex = 0;

var scaleTool = {
    
    start: function() {
    },
    
    mouseDown: function($scope) {
    },
    
    mouseUp: function($scope) {
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
        
        var mouseOldX = $scope.config.mouse.old.x - $scope.config.canvas.x;
        var mouseOldY = $scope.config.mouse.old.y - $scope.config.canvas.y; 
        
        var distanceOld = Math.sqrt(Math.pow(mouseOldY - y, 2) + Math.pow(mouseOldX - x, 2));
        
        /* Update old mouse. */
        $scope.config.mouse.old.x = $scope.config.mouse.current.x;
        $scope.config.mouse.old.y = $scope.config.mouse.current.y;
        
        /* Scale width and height */
        var scale = 0.5 + 0.5 * (distance / distanceOld);
        
        var width  = layer.getWidth();
        var height = layer.getHeight();
        var rotation = layer.getRotation();
        
        var originalWidth = width;
        var originalHeight = height;
        
        if (scaleToolIndex != 2 && scaleToolIndex != 6) {
            width *= scale;
        }
        
        if (scaleToolIndex != 0 && scaleToolIndex != 4) {
            height *= scale;      
        }
        
        /* Compensate for rotation. */
        //var width  = originalWidth  + (width - originalWidth) * Math.cos(rotation) + (height - originalHeight) * Math.sin(rotation);
        //var height = originalHeight + (width - originalWidth) * Math.cos(rotation) + (height - originalHeight) * Math.sin(rotation);
        
        // apply rotation to layer texture 
        // reset layer rotation matrix
        
        $scope.renderEngine.layers[currentLayer].setWidth(width);
        $scope.renderEngine.layers[currentLayer].setHeight(height);
         
        if (scaleToolIndex == 7 || scaleToolIndex == 0 || scaleToolIndex == 1) 
            x += 0.5 * (width - originalWidth);
        
        if (scaleToolIndex == 3 || scaleToolIndex == 4 || scaleToolIndex == 5) 
            x -= 0.5 * (width - originalWidth);
        
        if (scaleToolIndex == 5 || scaleToolIndex == 6 || scaleToolIndex == 7) 
            y += 0.5 * (height - originalHeight);
        
        if (scaleToolIndex == 1 || scaleToolIndex == 2 || scaleToolIndex == 3) 
            y -= 0.5 * (height - originalHeight);
        
        layer.setPos(x, y);
        
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});  
    },
};