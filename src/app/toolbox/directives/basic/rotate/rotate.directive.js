app.directive('rotate', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/rotate/rotate.tpl.html',
        controller: 'RotateCtrl'
    };
});

app.controller('RotateCtrl', function($scope) {
	$scope.toolname = 'rotate';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	/* init */
	$scope.init = function() {
		$scope.setCursor('grab');
		$scope.rotating = false;
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
		$scope.setCursor('grabbing');
		$scope.rotating = true;
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
		$scope.setCursor('grab');
		$scope.rotating = false;
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
		if (!$scope.rotating) return;
		 
		var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;

        var layer = $scope.getCurrentLayer();
        
        /* Get the location of the layer. */
        var x = layer.getPosX();
        var y = layer.getPosY();
        
        /* Get the mouse current location and the one before it. */
        var mouseCurrentX = $scope.config.mouse.current.x;
        var mouseCurrentY = $scope.config.mouse.current.y; 
        var mouseOldX = $scope.config.mouse.old.x;
        var mouseOldY = $scope.config.mouse.old.y;
        
        /* Update the old mouse position. */
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        /* Calculate the angle from the center to both points and add the
         * difference to the rotation. */
        var angleOld     = Math.atan2(mouseOldY     - y, mouseOldX     - x);
        var angleCurrent = Math.atan2(mouseCurrentY - y, mouseCurrentX - x);
        
        var difference = (angleOld - angleCurrent);
        var rotation = layer.getRotation();
        
        layer.setRotation(rotation + difference);
		$scope.editEngine.drawRotateTool(layer);
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});
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

			$scope.config.tools.activeToolFunctions = {
				mouseDown: $scope.mouseDown,
				mouseUp: $scope.mouseUp,
				mouseMove: $scope.mouseMove
			};
		} else {
			$scope.editEngine.clear();
		}

		if (oval) {
			var layer = $scope.getCurrentLayer();
            layer.commitTransformations();
		}
	}, true);
});