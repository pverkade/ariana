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

	/* init */
	$scope.init = function() {
		canvas.setCursor('crosshair');

		var currentLayer = layers.getCurrentIndex();
		if (currentLayer == -1) {
			console.log("No layer selected");
			return;
		}

		var layer = $scope.renderEngine.layers[currentLayer];
		if (layer.layerType != LayerType.ImageLayer) {
			console.log("Layer is not of type ImageLayer");
			return;
		}
		var image = layer.getImage();

		$scope.startSharedSelection(image.width, image.height);
		
		$scope.magic = new MagicSelection(image);
        $scope.magic.setMaskWand($scope.maskWand);
        $scope.magic.setMaskBorder($scope.maskBorder);
	};
    
    $scope.stop = function() {
        var scope = angular.element($("#main-canvas")).scope();
        scope.editEngine.removeSelectionLayer();
        // $scope.requestEditEngineUpdate();
    };

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.stop();

		/* x and y coordinates in pixels relative to canvas left top corner. */
		var xRelative = mouse.getPosX();
		var yRelative = mouse.getPosY();

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = layers.getCurrentIndex();
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        
        var transformation = layer.calculateTransformation();
        mat3.invert(transformation, transformation);
        var position = vec3.fromValues(xRelative, yRelative, 1);
        vec3.transformMat3(position, position, transformation);
        
        // FIXME only works in original state
        xRelative = Math.round(0.5 * (position[0] + 1) * $scope.magic.getWidth()); 
        yRelative = Math.round(0.5 * (position[1] - 1) * $scope.magic.getHeight());

		/* Check wheter user has clicked inside of a selection. */
        var bitmask = null;
		if ($scope.magic.isInSelection(xRelative, yRelative)) {
			$scope.magic.removeSelection(xRelative, yRelative);
		} else {
			bitmask = $scope.magic.getMaskWand(xRelative, yRelative, $scope.threshold);
		}

		$scope.magic.getMaskBorder();

		var width = $scope.magic.imageData.width;
		var height = $scope.magic.imageData.height;

		var canvas = document.getElementById("editing-canvas");
		var context = canvas.getContext("2d");
		var imgData = context.createImageData(width, height);

		if (bitmask) {
            /*var x = 0;
			for (var i = 0; i < bitmask.length; i++) {
				if (bitmask[i]) {
					imgData.data[4 * i] = 255;
					imgData.data[4 * i + 1] = 0;
					imgData.data[4 * i + 2] = 0;
					imgData.data[4 * i + 3] = 255;
                    x++;
				}
			}
            console.log("Bitmask size: " + x);*/
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    if (bitmask[y*width+x]) {
                        var i = (height-y)*width+x;
                        imgData.data[4 * i] = 255;
                        imgData.data[4 * i + 1] = 0;
                        imgData.data[4 * i + 2] = 0;
                        imgData.data[4 * i + 3] = 255;
                    }
                }
            }
			var newLayer = $scope.renderEngine.createSelectionImageLayer(imgData, 0);
            $scope.addLayer(newLayer);

            $scope.editEngine.setSelectionLayer($scope.marchingAnts, newLayer);
            $scope.requestRenderEngineUpdate();
            if ($scope.marchingAnts == null) {
                $scope.marchingAnts = new MarchingAnts($scope.magic.getWidth(), $scope.magic.getHeight());
                $scope.marchingAnts.setMaskBorder($scope.maskBorder);
                $scope.editEngine.setSelectionLayer($scope.marchingAnts, newLayer);
                $scope.requestRenderEngineUpdate();
            }            
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
