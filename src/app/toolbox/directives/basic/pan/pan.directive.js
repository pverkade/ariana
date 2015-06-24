app.directive('pan', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/pan/pan.tpl.html',
        controller: 'PanCtrl',
    };
});

app.controller('PanCtrl', function($scope, tools, canvas) {
	$scope.toolname = 'pan'
	$scope.active = tools.getTool() == $scope.toolname;

	/* init */
	$scope.init = function() {
		canvas.setCursor('grab');
		$scope.panning = false;
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
		canvas.setCursor('grabbing');
		$scope.panning = true;
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
		canvas.setCursor('grab');
		$scope.panning = false;
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        if (!$scope.panning) return;
        var z = $scope.config.canvas.zoom;
         
        var dx = mouse.getPosGlobal().x - mouse.getPosOldGlobal().x;
        var dy = mouse.getPosGlobal().y - mouse.getPosOldGlobal().y;
        
        // mouse.setPosOldGlobal(mouse.getPosGlobal().x, mouse.getPosGlobal().y);
        
        canvas.setX(canvas.getX() + dx);
        canvas.setY(canvas.getY() + dy);
    };
-
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
		if (nval)  {
			$scope.init();

			tools.setToolFunctions({
				mouseDown: $scope.mouseDown,
				mouseUp: $scope.mouseUp,
				mouseMove: $scope.mouseMove
			});
		}
	}, true);
});