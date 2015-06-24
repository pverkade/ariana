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
        $scope.rect.setMaskBorder($scope.maskBorder);

        $scope.drawEngine.setColor(0, 0, 0, 128);
        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.RECTANGLE);
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
        /* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y;  

        console.log(xMouse, yMouse);
        $scope.point1 = new Point(xMouse, yMouse);

        $scope.drawEngine.onMousedown(xMouse, yMouse);   
        $scope.mouseBTNDown = true; 
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
		// $scope.stop();

        /* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y; 

        $scope.point2 = new Point(xMouse, yMouse);
        var bitmask = $scope.rect.addRect($scope.point1, $scope.point2);

        for (var y = 0; y < $scope.rect.height; y++) {
            for (var x = 0; x < $scope.rect.width; x++) {
                if (bitmask[y * $scope.rect.width + x]) {
                    var i = ($scope.rect.height - y) * $scope.rect.width + x;
                    $scope.imgData.data[4 * i] = 255;
                    $scope.imgData.data[4 * i + 1] = 0;
                    $scope.imgData.data[4 * i + 2] = 0;
                    $scope.imgData.data[4 * i + 3] = 255;
                }
            }
        }

        var currentLayer = $scope.config.layers.currentLayer;//$scope.config.layers.currentLayer;

        var layer = $scope.renderEngine.layers[currentLayer];

        $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
        $scope.requestEditEngineUpdate();

        $scope.drawEngine.onMouseup(xMouse, yMouse);
        $scope.drawEngine.clearCanvases();
        $scope.mouseBTNDown = false;
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
		/* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y; 
        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        // console.log($scope.mouseBTNDown);
        if ($scope.mouseBTNDown) {
        	$scope.drawEngine.onMousemove(xMouse, yMouse);
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
	}, true);
});