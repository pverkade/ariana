angular.module('ariana').directive('scale', function() {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'app/toolbox/directives/basic/scale/scale.tpl.html',
		controller: 'ScaleCtrl'
	};
});

angular.module('ariana').controller('ScaleCtrl', function($scope) {
	$scope.toolname = 'scale';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

    
    $scope.sign = function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
    
	/* init */
	$scope.init = function() {
        $scope.scaling = false;
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.scaling = true;
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        $scope.scaling = false;
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        console.log("new scale");
        
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
        
        if ($scope.scaling) {

	        var width  = layer.getWidth();
	        var height = layer.getHeight();
	        var rotation = layer.getRotation();
	        
	        var originalWidth = width;
	        var originalHeight = height;

	        if ($scope.scaleToolIndex != 2 && $scope.scaleToolIndex != 6) {
	            width += (mouseCurrentX - mouseOldX) * $scope.sign(Math.cos(angle));
	            x += 0.5 * (mouseCurrentX - mouseOldX);
	        }
	        
	        if ($scope.scaleToolIndex != 0 && $scope.scaleToolIndex != 4) {
	            height += (mouseCurrentY - mouseOldY) * - $scope.sign(Math.sin(angle));  
	            y += 0.5 * (mouseCurrentY - mouseOldY);    
	        }
	        
	        $scope.renderEngine.layers[currentLayer].setWidth(width);
	        $scope.renderEngine.layers[currentLayer].setHeight(height);
	        
	        layer.setPos(x, y);
            
            window.requestAnimationFrame(function() {
                $scope.renderEngine.render();
            });

        } else {              
	        var differenceX = mouseCurrentX - x;
	        var differenceY = y - mouseCurrentY;
	              
	        /* Update the index and the cursor. */
	        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) {
	            
	            var ratio = Math.abs(differenceY) / Math.abs(differenceX);
	            var layerRatio = layer.getHeight() / layer.getWidth(); 
	            
	            $scope.scaleToolIndex = Math.round(8 * (angle / (2 * Math.PI)));
	            
	            if ($scope.scaleToolIndex == 0) { $scope.setCursor("e-resize"); };
	            if ($scope.scaleToolIndex == 1) { $scope.setCursor("ne-resize"); };
	            if ($scope.scaleToolIndex == 2) { $scope.setCursor("n-resize"); };
	            if ($scope.scaleToolIndex == 3) { $scope.setCursor("nw-resize"); };
	            if ($scope.scaleToolIndex == 4) { $scope.setCursor("w-resize"); };
	            if ($scope.scaleToolIndex == 5) { $scope.setCursor("sw-resize"); };
	            if ($scope.scaleToolIndex == 6) { $scope.setCursor("s-resize"); };
	            if ($scope.scaleToolIndex == 7) { $scope.setCursor("se-resize"); };
	            if ($scope.scaleToolIndex == 8) { $scope.setCursor("e-resize"); $scope.scaleToolIndex = 0; };
	            return;
	        }	
        } 
        
        /* Update old mouse. */
        $scope.config.mouse.old.x = $scope.config.mouse.current.x;
        $scope.config.mouse.old.y = $scope.config.mouse.current.y;
	};
    
	/*
	 * This will watch for this tools' "active" variable changes.
	 * When "active" changes to "true", this tools functions need to
	 * be registered to the global config.
	 * This functions NEEDS to be in each tools controller for
	 * the tool to function. Please assign the correct toolfunctions
	 * to the "activeToolFunctions" object.
	 * Always call "init" first;
	 */
	$scope.$watch('active', function(nval, oval) {
		if (nval) {
			$scope.init();

			$scope.config.tools.activeToolFunctions = {
				mouseDown: $scope.mouseDown,
				mouseUp:   $scope.mouseUp,
				mouseMove: $scope.mouseMove
			};
		}
	}, true);
});