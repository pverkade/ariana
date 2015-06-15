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
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	/* init */
	$scope.init = function() {
		$scope.setCursor('default');
        $scope.drawEngine.setDrawType(drawType.NORMAL);

        $scope.setColor($scope.config.tools.colors.primary);
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
        var image = $scope.drawEngine.getCanvasImageData();
        var imageLayer = $scope.renderEngine.createImageLayer(image);
        imageLayer.setPos(0.5 * image.width, 0.5 * image.height);
        $scope.renderEngine.addLayer(imageLayer);
        $scope.renderEngine.render();

        $scope.drawEngine.clearCanvases();
    }

	/* onMouseDown */
	$scope.mouseDown = function(event) {
        var buttons = $scope.config.mouse.button;
        if (buttons[1] && buttons[3]) return;

        if (buttons[1]) 
            $scope.setColor($scope.config.tools.colors.primary);
        else 
            $scope.setColor($scope.config.tools.colors.secondary);
        
        $scope.drawEngine.onMousedown(event);
	};

	/* onMouseUp */
	$scope.mouseUp = function(event) {
        $scope.drawEngine.onMouseup(event);
	};

	/* onMouseMove */
	$scope.mouseMove = function(event) {
		$scope.drawEngine.onMousemove(event);
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