var scaleToolIndex = 0;

function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

var scaleTool = {
    
    start: function() {
    },
    
    mouseDown: function($scope) {
    	var scope = angular.element($("#main-canvas")).scope();
    	scope.mouseButtonDown = true;
    	scope.chosenScaleToolIndex = scope.scaleToolIndex;
    },
    
    mouseUp: function($scope) {
    	var scope = angular.element($("#main-canvas")).scope();
    	scope.mouseButtonDown = false;
    },
    
    mouseMove: function($scope) {
    	var scope = angular.element($("#main-canvas")).scope();

        var mouseCurrentX = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var mouseCurrentY = $scope.config.mouse.current.y - $scope.config.canvas.y; 

        var mouseOldX = $scope.config.mouse.old.x - $scope.config.canvas.x;
        var mouseOldY = $scope.config.mouse.old.y - $scope.config.canvas.y; 

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var layer = $scope.renderEngine.layers[currentLayer];

        var x = layer.getPosX();
        var y = layer.getPosY();

        var angle = (Math.atan2(y - mouseCurrentY, mouseCurrentX - x) + 2 * Math.PI) % (2 * Math.PI);
        
        if (scope.mouseButtonDown) {

	        var width  = layer.getWidth();
	        var height = layer.getHeight();
	        var rotation = layer.getRotation();
	        
	        var originalWidth = width;
	        var originalHeight = height;

	        if (scope.scaleToolIndex != 2 && scope.scaleToolIndex != 6) {
	            width += (mouseCurrentX - mouseOldX) * sign(Math.cos(angle));
	            x += 0.5 * (mouseCurrentX - mouseOldX);
	        }
	        
	        if (scope.scaleToolIndex != 0 && scope.scaleToolIndex != 4) {
	            height += (mouseCurrentY - mouseOldY) * -sign(Math.sin(angle));  
	            y += 0.5 * (mouseCurrentY - mouseOldY);    
	        }
	        
	        /* Compensate for rotation. */
	        //var width  = originalWidth  + (width - originalWidth) * Math.cos(rotation) + (height - originalHeight) * Math.sin(rotation);
	        //var height = originalHeight + (width - originalWidth) * Math.cos(rotation) + (height - originalHeight) * Math.sin(rotation);
	        
	        $scope.renderEngine.layers[currentLayer].setWidth(width);
	        $scope.renderEngine.layers[currentLayer].setHeight(height);
	        
	        layer.setPos(x, y);

        } else {              
	        var differenceX = mouseCurrentX - x;
	        var differenceY = y - mouseCurrentY;
	              
	        /* Update the index and the cursor. */
	        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) {
	            
	            var ratio = Math.abs(differenceY) / Math.abs(differenceX);
	            var layerRatio = layer.getHeight() / layer.getWidth(); 
	            
	            scope.scaleToolIndex = Math.round(8 * (angle / (2 * Math.PI)));
	            
	            if (scope.scaleToolIndex == 0) {$("#background").css("cursor", "e-resize"); };
	            if (scope.scaleToolIndex == 1) { $("#background").css("cursor", "ne-resize"); };
	            if (scope.scaleToolIndex == 2) { $("#background").css("cursor", "n-resize"); };
	            if (scope.scaleToolIndex == 3) { $("#background").css("cursor", "nw-resize"); };
	            if (scope.scaleToolIndex == 4) { $("#background").css("cursor", "w-resize"); };
	            if (scope.scaleToolIndex == 5) { $("#background").css("cursor", "sw-resize"); };
	            if (scope.scaleToolIndex == 6) { $("#background").css("cursor", "s-resize"); };
	            if (scope.scaleToolIndex == 7) { $("#background").css("cursor", "se-resize"); };
	            if (scope.scaleToolIndex == 8) { $("#background").css("cursor", "e-resize"); scope.scaleToolIndex = 0; };
	            return;
	        }	
        } 
        
        /* Update old mouse. */
        $scope.config.mouse.old.x = $scope.config.mouse.current.x;
        $scope.config.mouse.old.y = $scope.config.mouse.current.y;
                
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});  
    },
};