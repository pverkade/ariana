app.directive('rectangle', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/rectangle/rectangle.tpl.html',
        controller: 'RectangleCtrl'
    };
});

app.controller('RectangleCtrl', function($scope) {
	$scope.toolname = 'rectangle';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	/* init */
	$scope.init = function() {
		$scope.setCursor('default');
        $scope.selection.maskEnabled = true;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) {
            console.log("No layer selected");
            return;
        }

        var layer = $scope.renderEngine.layers[currentLayer];
        if (layer.layerType != LayerType.ImageLayer) {
            console.log("Layer is not of type ImageLayer");
            return;
        }
        $scope.image = layer.getImage();

        $scope.rect = new RectangleSelection($scope.image.width, $scope.image.height);

        $scope.mouseBTNDown = false;

        $scope.startSharedSelection($scope.image.width, $scope.image.height);
        $scope.setSelectionTool($scope.rect);
        $scope.rect.setMaskWand($scope.maskWand);
        $scope.rect.setMaskWandParts($scope.maskWandParts);
        $scope.rect.setMaskBorder($scope.maskBorder);

        $scope.drawEngine.setColor(0, 0, 0, 256);
        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.RECTANGLE);

        $scope.setMaskSelectedArea($scope.rect.width, $scope.rect.height);
	};

    $scope.stop = function() {
        $scope.editEngine.removeSelectionLayer();
        $scope.requestEditEngineUpdate();
    };

	/* onMouseDown */
	$scope.mouseDown = function() {
        /* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y;  

        $scope.point1 = new Point(xMouse, yMouse);

        /* Check wheter user has clicked inside of a selection. */
        if ($scope.rect.isInSelection(xMouse, yMouse)) {
            $scope.rect.removeSelection(xMouse, yMouse);
        }

        $scope.drawEngine.onMousedown(xMouse, yMouse);   
        $scope.mouseBTNDown = true; 
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        /* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y; 

        $scope.rect.addRect($scope.point1, $scope.point2);

        /* Draw shared mask variables to image. */
        if ($scope.maskWand) {
            $scope.setMaskSelectedArea($scope.rect.width, $scope.rect.height);    
            var currentLayer = $scope.config.layers.currentLayer;
            var layer = $scope.renderEngine.layers[currentLayer];
            $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
            $scope.requestEditEngineUpdate();      
        }

        $scope.drawEngine.onMouseup(xMouse, yMouse);
        $scope.drawEngine.clearCanvases();
        $scope.mouseBTNDown = false;
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
		/* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y; 

        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        if ($scope.mouseBTNDown) {
            var point2 = new Point(xMouse, yMouse);
            if ($scope.rect.validRect($scope.point1, point2)) {
                $scope.point2 = point2;
                $scope.drawEngine.onMousemove(xMouse, yMouse);
            } else { 
                var dX = $scope.rect.sign(point2.x - $scope.point1.x);
                var dY = $scope.rect.sign(point2.y - $scope.point1.y);
                point2 = new Point($scope.point2.x + dX, $scope.point2.y + dY);
                if ($scope.rect.validRect($scope.point1, point2)) {
                    $scope.point2 = point2;
                    $scope.drawEngine.onMousemove(point2.x, point2.y);
                }
            }
        }
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
				mouseUp: $scope.mouseUp,
				mouseMove: $scope.mouseMove
			};
		} 
        else if (oval) {
            $scope.stop();
        }
	}, true);
});