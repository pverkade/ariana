/* 
 * Project Ariana
 * rotate.directive.js
 * 
 * This file contains the RotateController and directive, 
 * which control the rotate tool in the toolbox.
 *
 */
 
app.directive('rotate', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/rotate/rotate.tpl.html',
        controller: 'RotateCtrl'
    };
});

app.controller('RotateCtrl', function($scope, tools, canvas, layers) {
	$scope.toolname = 'rotate';
	$scope.active = tools.getTool() == $scope.toolname;

	/* init */
	$scope.init = function() {
		canvas.setCursor('grab');
		$scope.rotating = false;
        
        var currentLayer = layers.getCurrentIndex();
        if (currentLayer == -1) return;

        var layer = $scope.renderEngine.layers[currentLayer];
		$scope.requestRenderEngineUpdate();
		$scope.editEngine.setEditLayer(layer, EditMode.rotate);
		$scope.requestEditEngineUpdate();
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
		canvas.setCursor('grabbing');
		$scope.rotating = true;
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
		canvas.setCursor('grab');
		$scope.rotating = false;
        $scope.updateThumbnail($scope.getCurrentLayerIndex());
    };

	/* onMouseMove */
	$scope.mouseMove = function() {
		if (!$scope.rotating) return;
		 
		var currentLayer = layers.getCurrentLayerIndex();
        if (currentLayer == -1) return;

        var layer = $scope.getCurrentLayer();
        
        /* Get the location of the layer. */
        var x = layer.getPosX();
        var y = layer.getPosY();
        
        /* Get the mouse current location and the one before it. */
        var mouseCurrentX = mouse.getPos().x;
        var mouseCurrentY = mouse.getPos().y; 
        var mouseOldX = mouse.getPosOld().x;
        var mouseOldY = mouse.getPosOld().y;
        
        /* Update the old mouse position. */
        var dx = mouse.getPos().x - mouse.getPosOld().x;
        var dy = mouse.getPos().y - mouse.getPosOld().y;
        mouse.setPosOld(mouse.getPosOld().x + dx, mouse.getPosOld().y + dy);
        
        /* Calculate the angle from the center to both points and add the
         * difference to the rotation. */
        var angleOld     = Math.atan2(mouseOldY     - y, mouseOldX     - x);
        var angleCurrent = Math.atan2(mouseCurrentY - y, mouseCurrentX - x);
        
        var difference = (angleOld - angleCurrent);
        var rotation = layer.getRotation();
        
        layer.setRotation(rotation + difference);
        $scope.requestRenderEngineUpdate();

		$scope.editEngine.setEditLayer(layer, EditMode.rotate);
        $scope.requestEditEngineUpdate();
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
		} else {
			$scope.editEngine.clear();
		}

		if (oval) {
            $scope.editEngine.removeEditLayer();
			var layer = $scope.getCurrentLayer();
            layer.commitTransformations();
            $scope.updateThumbnail($scope.getCurrentLayerIndex());
		}
	}, true);
});