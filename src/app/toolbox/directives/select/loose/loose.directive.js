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
        /* working with $scope to share variables between functions in this file does not seem to work. */
        var scope = angular.element($("#main-canvas")).scope();

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
        scope.image = layer.getImage();

        scope.looseSelection = new LooseSelection(scope.image.width, scope.image.height);

        scope.canvas = document.createElement("canvas");
        scope.canvas.width = scope.image.width;
        scope.canvas.height = scope.image.height;
        scope.context = scope.canvas.getContext("2d");

        scope.imgData = scope.context.createImageData(scope.looseSelection.width, scope.looseSelection.height);

        scope.edit_canvas = document.getElementById("editing-canvas");
        scope.edit_context = scope.edit_canvas.getContext("2d");

        scope.mouseBTNDown = false;

        scope.drawEngine.setLineWidth(2);
        scope.drawEngine.setDrawType(drawType.NORMAL);
	};

	/* onMouseDown */
	$scope.mouseDown = function() {
        var scope = angular.element($("#main-canvas")).scope();

        var color = $scope.config.tools.colors.primary;
        $scope.drawEngine.setColor(0, 0, 0, 1.0);

        $scope.drawEngine.onMousedown(event);   
        scope.mouseBTNDown = true; 
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        var scope = angular.element($("#main-canvas")).scope();

        scope.looseSelection.reset();
        scope.mouseBTNDown = false;

        $scope.drawEngine.onMouseup(event);
        $scope.drawEngine.clearCanvases();
        scope.edit_context.putImageData(scope.imgData, 0, 0);
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        /* working with $scope to share variables between functions in this file does not seem to work. */
        var scope = angular.element($("#main-canvas")).scope();

        /* x and y coordinates in pixels relative to image. */
        xRelative = $scope.config.mouse.current.x - $scope.config.canvas.x;
        yRelative = $scope.config.mouse.current.y - $scope.config.canvas.y;    

        if (scope.mouseBTNDown == true) {
            if (scope.looseSelection.addPoint(new Point(xRelative, yRelative))) {
                var boundingPath = scope.looseSelection.getBoundingPath();
                if (boundingPath.length != 0) {
                    var bitmaskBorder = scope.looseSelection.getMaskBorder();
                    var bitmask = scope.looseSelection.getMaskWand();
                    // var maskAnts = scope.looseSelection.marchingAnts(8, 0);
					if (bitmask) {
						for (var i = 0; i < bitmask.length; i++) {
							if (bitmask[i]) {
								scope.imgData.data[4 * i] = 255;
								scope.imgData.data[4 * i + 1] = 0;
								scope.imgData.data[4 * i + 2] = 0;
								scope.imgData.data[4 * i + 3] = 255;
							}
						}
						var layer = scope.renderEngine.createSelectionImageLayer(scope.imgData, 0);
						scope.renderEngine.removeLayer(0);
						scope.renderEngine.addLayer(layer);
						scope.renderEngine.render();

						console.log(scope.looseSelection);
						scope.editEngine.setSelectionLayer(scope.looseSelection, layer);
			            scope.requestEditEngineUpdate();
					}

                    scope.looseSelection.reset();

                    /* When a bounding path is drawn the bounding path is draw and user interface acts like
                        the user has released the mouse button. */
                    $scope.drawEngine.onMouseup(event);
                    scope.mouseBTNDown = false;
                }
            }    
        }

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
	}, true);
});