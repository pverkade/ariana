app.directive('pencil', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/pencil/pencil.tpl.html',
        controller: 'PencilCtrl'
    };
});

app.controller('PencilCtrl', function($scope) {
	$scope.toolname = 'pencil';
	$scope.active = ($scope.config.tools.activeTool == $scope.toolname);
    $scope.thickness = 2;
    $scope.opacity = 1;
    
    $scope.currentLayer = -1;
    $scope.numberOfLayers = 0;
    
	/* init */
	$scope.init = function() {
        $scope.drawing = false;
        $scope.hasDrawn = false;
		$scope.setCursor('default');
        $scope.drawEngine.setDrawType(drawType.NORMAL);
        $scope.setColor($scope.config.tools.colors.primary);
        $scope.updateDrawEngine();

        /* If the last layer is not selected, draw between other layers. */
        $scope.paintTopCanvas();
	};

    $scope.paintTopCanvas = function() {
        /* TODO: do stop() and init() when another layer is selected? */

        $scope.currentLayer = $scope.config.layers.currentLayer;
        $scope.numberOfLayers = $scope.config.layers.numberOfLayers;
        if ($scope.currentLayer == $scope.numberOfLayers - 1) {
            return;
        }

        /* Render only the underlying layer(s) to the maincanvas */
        var lowerIndices = [];
        for (var i = 0; i <= $scope.currentLayer; i++) {
            lowerIndices.push(i);
        }
        
        $scope.renderEngine.renderIndices(lowerIndices);

        /* Draw the above lying layer(s) to */
        var upperIndices = [];
        for (var i = $scope.currentLayer + 1; i < $scope.numberOfLayers; i++) {
            upperIndices.push(i);
        }
        
        var topCanvasImage = new Image();
        topCanvasImage.src = $scope.renderEngine.renderIndicesToImg(upperIndices);

        var topCanvas = document.getElementById('top-canvas');
        var topCanvasContext = topCanvas.getContext('2d');
        topCanvasContext.scale(1, -1);
        topCanvasContext.drawImage(topCanvasImage, 0, -topCanvasImage.height);
    }
    
    $scope.updateDrawEngine = function() {
        $scope.drawEngine.setLineWidth($scope.thickness);
        $scope.drawEngine.setOpacity($scope.opacity);
    }
    
    $scope.setColor = function(color) {
        $scope.drawEngine.setColor(
            color.r,
            color.g,
            color.b,
            1.0
        );
    };
    
    $scope.stop = function() {
        if ($scope.hasDrawn) {
            var image = $scope.drawEngine.getCanvasImageData();
            $scope.newLayerFromImage(image, $scope.currentLayer + 1);
            
            $scope.drawEngine.clearCanvases();
        }

        /* clear the top-canvas */
        if ($scope.currentLayer < $scope.numberOfLayers - 1) {
            var topCanvas = document.getElementById('top-canvas');
            var topCanvasContext = topCanvas.getContext('2d');
            topCanvasContext.clearRect(0, 0, topCanvas.width, topCanvas.height);
        }
    }

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.drawing = true;
        
        var buttons = $scope.config.mouse.button;
        if (buttons[1] && buttons[3]) return;

        if (buttons[1]) 
            $scope.setColor($scope.config.tools.colors.primary);
        else 
            $scope.setColor($scope.config.tools.colors.secondary);
        
        $scope.drawEngine.onMousedown($scope.config.mouse.current.x, $scope.config.mouse.current.y);
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        $scope.drawing = false;
        $scope.drawEngine.onMouseup($scope.config.mouse.current.x, $scope.config.mouse.current.y);
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        if (!$scope.drawing) return;
        $scope.hasDrawn = true;
		$scope.drawEngine.onMousemove($scope.config.mouse.current.x, $scope.config.mouse.current.y);
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