/* 
 * Project Ariana
 * pencil.directive.js
 * 
 * This file contains the PencilController and directive, 
 * which control the pencil tool in the toolbox.
 *
 */
 
app.directive('pencil', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/pencil/pencil.tpl.html',
        controller: 'PencilCtrl'
    };
});

app.controller('PencilCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', 'colors', function($scope, tools, canvas, layers, mouse, colors) {
	$scope.toolname = 'pencil';
	$scope.active = (tools.getTool() == $scope.toolname);
    $scope.thickness = 2;
    $scope.opacity = 1;
    
	$scope.init = function() {
        $scope.drawing = false;
        $scope.hasDrawn = false;
		canvas.setCursor('default');
        $scope.drawEngine.setDrawType(drawType.NORMAL);
        $scope.setColor(colors.getPrimary());
        $scope.updateDrawEngine();
	};
    
    $scope.updateDrawEngine = function() {
        $scope.drawEngine.setLineWidth($scope.thickness);
        $scope.drawEngine.setOpacity($scope.opacity);
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
        
        $scope.hasDrawn = false;
    }

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
