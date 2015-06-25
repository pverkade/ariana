/* 
 * Project Ariana
 * magic.directive.js
 * 
 * This file contains the MagicController and directive, 
 * which controls the magic selection tool in the toolbox.
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

app.controller('MagicCtrl', function($scope) {
	$scope.toolname = 'magic';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	$scope.threshold = 35;

	$scope.init = function() {
		$scope.setCursor('crosshair');
        $scope.selection.maskEnabled = true;

		var currentLayer = $scope.config.layers.currentLayer;
		if (currentLayer == -1) {
			return;
		}

		var layer = $scope.renderEngine.layers[currentLayer];
		if (layer.layerType != LayerType.ImageLayer) {
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
	};
    
    $scope.stop = function() {
        $scope.editEngine.removeSelectionLayer();
        $scope.requestEditEngineUpdate();
    };

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.stop();

		/* x and y coordinates in pixels relative to canvas left top corner. */
		var mouseX = $scope.config.mouse.current.x;
		var mouseY = $scope.config.mouse.current.y;

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        
        var transformedPoint = $scope.magic.transform(layer, mouseX, mouseY);
        xRelative = transformedPoint.x;
        yRelative = transformedPoint.y;

        console.log("position on image", xRelative, yRelative);
        
		/* Check wheter user has clicked inside of a selection. */
		if ($scope.magic.isInSelection(xRelative, yRelative)) {
			$scope.magic.removeSelection(xRelative, yRelative)
		} else {
			$scope.magic.getMaskWand(xRelative, yRelative, $scope.threshold);
		}

		/* Draw shared mask variables to image. */
		if ($scope.maskWand) {
			$scope.setMaskSelectedArea($scope.magic.width, $scope.magic.height);    
            var currentLayer = $scope.config.layers.currentLayer;
            var layer = $scope.renderEngine.layers[currentLayer];
            $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
            $scope.requestEditEngineUpdate();      
		}
	};

	/* onMouseUp */
	$scope.mouseUp = function() {

	};

	/* onMouseMove */
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