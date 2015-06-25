/* 
 * Project Ariana
 * brush.directive.js
 * 
 * This file contains the BrushController and directive, 
 * which control the brush in the toolbox.
 *
 */
 
app.directive('brush', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/brush/brush.tpl.html',
        controller: 'BrushCtrl'
    };
});

app.controller('BrushCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', 'colors', function($scope, tools, canvas, layers, mouse, colors) {

	$scope.toolname = 'brush';
	$scope.active = tools.getTool() == $scope.toolname;
    $scope.thickness = 2;
    $scope.opacity = 1;
    $scope.brush = "thin";

    $scope.currentLayer = -1;
    $scope.numberOfLayers = 0;
        
	/* init */
	$scope.init = function() {
        $scope.drawing = false;
        $scope.hasDrawn = false;
		canvas.setCursor('default');
        $scope.setColor(colors.getPrimary());
        
        $scope.updateDrawEngine();
        $scope.updateBrushStyle();

        /* If the last layer is not selected, draw between other layers. */
        $scope.paintTopCanvas();
	};

    $scope.paintTopCanvas = function() {
        /* TODO: do stop() and init() when another layer is selected? */

        $scope.currentLayer = layers.getCurrentIndex();
        $scope.numberOfLayers = layers.getNumLayers();
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
        for (i = $scope.currentLayer + 1; i < $scope.numberOfLayers; i++) {
            upperIndices.push(i);
        }
        
        var topCanvasImage = new Image();
        topCanvasImage.src = $scope.renderEngine.renderIndicesToImg(upperIndices);

        var topCanvas = document.getElementById('top-canvas');
        var topCanvasContext = topCanvas.getContext('2d');
        topCanvasContext.scale(1, -1);
        topCanvasContext.drawImage(topCanvasImage, 0, -topCanvasImage.height);
    };
    
    $scope.updateDrawEngine = function() {
        $scope.drawEngine.setLineWidth($scope.thickness);
        $scope.drawEngine.setOpacity($scope.opacity);
    };
    
    $scope.updateBrushStyle = function() {
        if ($scope.brush == "thin") {
            $scope.brushStyle = brushType.THIN;
        }
        if ($scope.brush == "pen") {
            $scope.brushStyle = brushType.PEN;
        }
        if ($scope.brush == "neighbor") {
            $scope.brushStyle = brushType.NEIGHBOR;
        }
        if ($scope.brush == "fur") {
            $scope.brushStyle = brushType.FUR;
        }
        if ($scope.brush == "multistroke") {
            $scope.brushStyle = brushType.MULTISTROKE;
        }
        $scope.drawEngine.setBrush($scope.brushStyle);
    };

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
    };

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.drawing = true;
        
        if (mouse.getPrimary() && mouse.getSecondary()) return;
        
        if (mouse.getPrimary()) 
            $scope.setColor(colors.getPrimary());
        else 
            $scope.setColor(colors.getSecondary());
        
        $scope.drawEngine.onMousedown(mouse.getPosX(), mouse.getPosY());
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        $scope.drawing = false;
        $scope.drawEngine.onMouseup(mouse.getPosX(), mouse.getPosY());
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        if (!$scope.drawing) return;
        $scope.hasDrawn = true;
		$scope.drawEngine.onMousemove(mouse.getPosX(), mouse.getPosY());
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

			tools.setToolFunctions({
				mouseDown: $scope.mouseDown,
				mouseUp: $scope.mouseUp,
				mouseMove: $scope.mouseMove
			});
		}
        else if (oval) {
            $scope.stop();
        }
	}, true);
}]);