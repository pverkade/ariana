app.directive('scale', function() {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'app/toolbox/directives/basic/scale/scale.tpl.html',
		controller: 'ScaleCtrl'
	};
});

app.controller('ScaleCtrl', function($scope) {
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
        
		var mouseCurrentX = $scope.config.mouse.current.x;
        var mouseCurrentY = $scope.config.mouse.current.y; 

        var mouseOldX = $scope.config.mouse.old.x;
        var mouseOldY = $scope.config.mouse.old.y; 

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
            
            var newWidth = width;
            var newHeight = height;

            var xScaleFactor = 1, yScaleFactor = 1;


	        if ($scope.scaleToolIndex != 2 && $scope.scaleToolIndex != 6) {
                xScaleFactor = 0.5 * (mouseCurrentX - mouseOldX) / (mouseOldX - x) + 1;

                if (isNaN(xScaleFactor) || xScaleFactor === 0 || !isFinite(xScaleFactor)) {
                    xScaleFactor = 1;
                }

                newWidth *= xScaleFactor;
            }
	        
	        if ($scope.scaleToolIndex != 0 && $scope.scaleToolIndex != 4) {
                yScaleFactor = 0.5 * (mouseCurrentY - mouseOldY) / (mouseOldY - y) + 1;

                if (isNaN(yScaleFactor) || yScaleFactor === 0 || !isFinite(yScaleFactor)) {
                    yScaleFactor = 1;
                }

                newHeight *= yScaleFactor;
            }

            var widthAndHeight = layer.getTransformedDimensions();
            var transformedWidth = widthAndHeight[0], transformedHeight = widthAndHeight[1];

            console.log(transformedWidth, transformedHeight);

            var deltaX  = (xScaleFactor - 1) * transformedWidth * 0.5;
            var deltaY  = (yScaleFactor - 1) * transformedHeight * 0.5;

            //deltaX = 0;
            //deltaY = 0;

            if (3 <= $scope.scaleToolIndex && $scope.scaleToolIndex <= 5) {
                deltaX *= -1;
            }

            if (1 <= $scope.scaleToolIndex && $scope.scaleToolIndex <= 3) {
                deltaY *= -1;
            }

            // var newX = x;
            // var newY = y;

	        layer.setWidth(newWidth);
	        layer.setHeight(newHeight);
	        layer.setPos(x + deltaX, y + deltaY);
            
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
		else if (oval) {
			var layer = $scope.renderEngine.getLayer($scope.config.layers.currentLayer);
			layer.commitDimensions();
		}
	}, true);
});