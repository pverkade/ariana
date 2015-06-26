/* 
 * Project Ariana
 * magic.directive.js
 * 
 * This file contains the MagicController and directive, 
 * which control the magic selection tool in the toolbox.
 *
 */
 
app.directive('magic', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/magic/magic.tpl.html',
        controller: 'MagicCtrl'
    };
});

app.controller('MagicCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', function($scope, tools, canvas, layers, mouse) {

	$scope.toolname = 'magic';
	$scope.active = tools.getTool() == $scope.toolname;

	$scope.threshold = 35;
	$scope.magic = null;

	$scope.init = function() {
        $scope.selection.maskEnabled = true;
		canvas.setCursor('crosshair');

        var layer = $scope.getCurrentLayer();
        if (layer == null) return;

		if (layer.getLayerType() != LayerType.ImageLayer) {
			return;
		}
        
		var image = layer.getImage();
        
		$scope.magic = new MagicSelection(image);

		$scope.startSharedSelection(image.width, image.height);
       	$scope.setSelectionTool($scope.magic);
        $scope.magic.setMaskWand($scope.maskWand);
        $scope.magic.setMaskWandParts($scope.maskWandParts);
        $scope.magic.setMaskBorder($scope.maskBorder);

        $scope.setMaskSelectedArea($scope.magic.width, $scope.magic.height);
        
        $scope.editEngine.removeEditLayer();
	};
    
    $scope.stop = function() {
    };

	$scope.mouseDown = function() {
		console.log("Mouse down magic");
		/* x and y coordinates in pixels relative to canvas left top corner. */
		var mouseX = mouse.getPosX();
		var mouseY = mouse.getPosY();

        /* Calculate x and y coordinates in pixels of the original image */

        var layer = $scope.getCurrentLayer();
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        var transformedPoint = $scope.magic.transform(layer, mouseX, mouseY);
        var xRelative = transformedPoint.x;
        var yRelative = transformedPoint.y;
        
		$scope.magic.getMaskWand(xRelative, yRelative, $scope.threshold);

		/* Draw shared mask variables to image. */
		if ($scope.maskWand) {
			$scope.setMaskSelectedArea($scope.magic.width, $scope.magic.height);    

			if (layer == null) {
				console.log ("layer is null, dunno how we got here.");
				return;
			}

            $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
            $scope.requestEditEngineUpdate();      
		}
	};

	$scope.mouseUp = function() {
	};

	$scope.mouseMove = function() {
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
