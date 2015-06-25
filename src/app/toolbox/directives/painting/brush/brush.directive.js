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
    $scope.intensity = 1;
    $scope.brush = "thin";

	/* init */
	$scope.init = function() {
        $scope.drawing = false;
        $scope.hasDrawn = false;
		canvas.setCursor('default');
        $scope.setColor(colors.getPrimary());
        
        $scope.updateDrawEngine();
        $scope.updateBrushStyle();
	};
    
    $scope.updateDrawEngine = function() {
        $scope.drawEngine.setLineWidth($scope.thickness);
        $scope.drawEngine.setOpacity($scope.opacity);
        $scope.drawEngine.setIntensity($scope.intensity);
    };
    
    $scope.updateBrushStyle = function() {
        if ($scope.brush == "thin") {
            $scope.brushStyle = brushType.THIN;
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
            $scope.newLayerFromImage(image);
            $scope.drawEngine.clearCanvases();
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
