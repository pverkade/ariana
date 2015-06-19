angular.module('ariana').directive('loose', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/loose/loose.tpl.html',
        controller: 'LooseCtrl'
    };
});

angular.module('ariana').controller('LooseCtrl', function($scope) {
	$scope.toolname = 'loose';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	/* init */
	$scope.init = function() {
		$scope.setCursor('default');

        var currentLayer = 0;//$scope.config.layers.currentLayer;
        if (currentLayer == -1) {
            console.log("No layer selected");
            return;
        }

        var layer = $scope.renderEngine.layers[currentLayer];
        if (layer.layerType != LayerType.ImageLayer) {
            console.log("Layer is not of type ImageLayer");
            return;
        }
        $scope.image = layer.getImage();

        $scope.loose = new LooseSelection($scope.image.width, $scope.image.height);

        $scope.canvas = document.createElement("canvas");
        $scope.canvas.width = $scope.image.width;
        $scope.canvas.height = $scope.image.height;
        $scope.context = $scope.canvas.getContext("2d");

        $scope.imgData = $scope.context.createImageData($scope.loose.width, $scope.loose.height);

        $scope.edit_canvas = document.getElementById("editing-canvas");
        $scope.edit_context = $scope.edit_canvas.getContext("2d");

        $scope.mouseBTNDown = false;

        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.DOTTED);
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.drawEngine.onMousedown(event);   
        $scope.mouseBTNDown = true; 
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        $scope.loose.reset();
        $scope.mouseBTNDown = false;

        $scope.drawEngine.onMouseup(event);
        $scope.drawEngine.clearCanvases();
        // $scope.edit_context.putImageData($scope.imgData, 0, 0);
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        /* x and y coordinates in pixels relative to image. */
        xRelative = $scope.config.mouse.current.x;
        yRelative = $scope.config.mouse.current.y;    

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        if ($scope.mouseBTNDown == true) {
            if ($scope.loose.addPoint(new Point(xRelative, yRelative))) {
                var boundingPath = $scope.loose.getLastBoundingPath();
                if (boundingPath.length != 0) {
                    var bitmask = $scope.loose.getMaskWand();
					if (bitmask) {
						for (var i = 0; i < bitmask.length; i++) {
							if (bitmask[i]) {
								$scope.imgData.data[4 * i] = 255;
								$scope.imgData.data[4 * i + 1] = 0;
								$scope.imgData.data[4 * i + 2] = 0;
								$scope.imgData.data[4 * i + 3] = 255;
							}
						}
                        var newLayer = $scope.renderEngine.createSelectionImageLayer($scope.imgData, 0);
                        $scope.addLayer(newLayer);
                        $scope.editEngine.setSelectionLayer($scope.loose, newLayer);
                        $scope.requestRenderEngineUpdate();

					}

                    $scope.loose.reset();

                    /* When a bounding path is drawn the bounding path is draw and user interface acts like
                        the user has released the mouse button. */
                    $scope.drawEngine.onMouseup(event);
                    $scope.mouseBTNDown = false;
                }
            }    
        }

        $scope.drawEngine.onMousemove(xRelative, yRelative);		
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