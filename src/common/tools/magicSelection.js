

var magicSelection = {
    
    start: function($scope) {
        console.log("Magic selection start");
        $("#main-canvas").css("cursor", "crosshair");

        /* working with $scope to share variables between functions in this file does not seem to work. */
        var scope = angular.element($("#main-canvas")).scope();

        /*scope.imgData = new ImgData($scope.renderEngine.getWidth(), $scope.renderEngine.getHeight());
        scope.imgData.data = $scope.renderEngine.renderAsUint8Array();
        scope.magic = new MagicSelection(scope.imgData);*/
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
        var image = layer.getImage();
        scope.magic = magicSelection = new MagicSelection(image);


        // $interval(callAtInterval, 1000);
        scope.sizeAnts = 4;
        scope.offset = 0;
    },
    
    mouseDown: function($scope) {
        var scope = angular.element($("#main-canvas")).scope();

        /* x and y coordinates in pixels relative to image. */
        var xRelative = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var yRelative = $scope.config.mouse.current.y - $scope.config.canvas.y;
        console.log(xRelative, yRelative);

        /* Check wheter user has clicked inside of a selection. */
        if (scope.magic.isInSelection(xRelative, yRelative)) {
            scope.magic.removeSelection(xRelative, yRelative)
        } else {
            scope.magic.getMaskWand(xRelative, yRelative, 10);
        }

        scope.magic.getMaskBorder();
        maskAnts = scope.magic.marchingAnts(scope.sizeAnts * 2, scope.offset);
        maskAnts = scope.magic.maskAnts[0];

        var canvas = document.getElementById("editing-canvas");
        var context = canvas.getContext("2d");

        var bitmask = scope.magic.maskBorder; //Wand[0];
        var width = scope.magic.imageData.width; // bitmask[0].length;
        console.log("width is " + width);
        var height = scope.magic.imageData.height; //bitmask.length;
        console.log("height is " + height);

        var notZero = 0;
        for (var i = 0; i < bitmask.length; i++) {
            if (bitmask[i]) {
                notZero++;
            }
        }
        console.log("Not zero: " + notZero);
        var imgData = context.createImageData(width, height);

        for (var i=0; i < bitmask.length; i++) {

        	if (bitmask[i] && maskAnts[i]) {
	         	imgData.data[4*i] = 255*bitmask[i];
	        	imgData.data[4*i+1] = 255*bitmask[i];
	        	imgData.data[4*i+2] = 255*bitmask[i];
	        	imgData.data[4*i+3] = 255; 
	        } else if (bitmask[i] && maskAnts[i] == 0) {
	         	imgData.data[4*i] = 0;	//255*bitmask[i];
	        	imgData.data[4*i+1] = 0;	//255*bitmask[i];
	        	imgData.data[4*i+2] = 0;	//255*bitmask[i];
	        	imgData.data[4*i+3] = 255;
        	} else {
	         	imgData.data[4*i] = scope.magic.imageData.data[4*i];
	        	imgData.data[4*i+1] = scope.magic.imageData.data[4*i+1];
	        	imgData.data[4*i+2] = scope.magic.imageData.data[4*i+2];
	        	imgData.data[4*i+3] = 255; 
        	}

        }
        console.log(imgData);


        context.putImageData(imgData, 0, 0);

        /* Save border and marching ants mask in scope. */
        //$scope.maskBorder = $scope.magic.getMaskBorder();
        //$scope.maskAnts = $scope.magic.marchingAnts(scope.sizeAnts * 2, scope.offset);
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown
    },

    callAtInterval: function($scope) {
        $scope.offset++;
        $scope.maskAnts = $scope.magic.marchingAnts($scope.sizeAnts * 2, $scope.offset);
    }
}