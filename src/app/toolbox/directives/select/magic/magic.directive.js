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

	$scope.threshold = 0.5;

	/* init */
	$scope.init = function() {
		$scope.setCursor('crosshair');

		/* working with $scope to share variables between functions in this file does not seem to work. */
		var scope = angular.element($("#main-canvas")).scope();

		var currentLayer = $scope.config.layers.currentLayer;
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
		scope.magic = new MagicSelection(image);
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
		console.log("MAGIC");
		var scope = angular.element($("#main-canvas")).scope();

		/* x and y coordinates in pixels relative to canvas left top corner. */
		var xRelative = $scope.config.mouse.current.x;
		var yRelative = $scope.config.mouse.current.y;

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        
        var transformation = layer.calculateTransformation();
        mat3.invert(transformation, transformation);
        var position = vec3.fromValues(xRelative, yRelative, 1);
        vec3.transformMat3(position, position, transformation);
        
        console.log("position " + xRelative + ", " + yRelative);
        xRelative = Math.round(0.5 * (position[0] + 1) * scope.magic.getWidth()); 
        yRelative = Math.round(0.5 * (position[1] - 1) * scope.magic.getHeight());
        console.log("original " + xRelative + ", " + yRelative);    

		/* Check wheter user has clicked inside of a selection. */
		if (scope.magic.isInSelection(xRelative, yRelative)) {
			scope.magic.removeSelection(xRelative, yRelative)
		} else {
			var bitmask = scope.magic.getMaskWand(xRelative, yRelative, 50);
		}

		scope.magic.getMaskBorder();

		var width = scope.magic.imageData.width;
		var height = scope.magic.imageData.height;

		var canvas = document.getElementById("editing-canvas");
		var context = canvas.getContext("2d");
		var imgData = context.createImageData(width, height);

		if (bitmask) {
            var x = 0;
			for (var i = 0; i < bitmask.length; i++) {
				if (bitmask[i]) {
					imgData.data[4 * i] = 255;
					imgData.data[4 * i + 1] = 0;
					imgData.data[4 * i + 2] = 0;
					imgData.data[4 * i + 3] = 255;
                    x++;
				}
			}
            console.log("Bitmask size: " + x);
			var newLayer = scope.renderEngine.createSelectionImageLayer(imgData, 0);
            scope.addLayer(newLayer);

			scope.editEngine.setSelectionLayer(scope.magic, newLayer);
            scope.requestEditEngineUpdate();
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
	}, true);
});