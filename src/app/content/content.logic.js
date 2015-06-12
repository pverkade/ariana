/* 
 * Project Ariana
 * content.logic.js
 * 
 * This file contains the ContenController, which controls the canvas in the
 * center of the screen.
 *
 */

/* The ContenController contains the behaviour of the main content. */
angular.module('ariana').controller('ContentController', function($scope, $window) {

    /* Set the cursor for the deafult tool: the pan tool. */
    // $("#background").css("cursor", "grab");

    /* This function is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();

        //$scope.config.mouse.old.x = $scope.config.mouse.current.x;
        //$scope.config.mouse.old.y = $scope.config.mouse.current.y;

        $scope.config.mouse.current.x = event.pageX;
        $scope.config.mouse.current.y = event.pageY;

        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        //if (toolFunctions && $scope.config.mouse.click.down) toolFunctions.mouseMove($scope, event);
        if (toolFunctions) toolFunctions.mouseMove($scope, event);
    };

    /* This function is triggered on a click. */
    $scope.mouseDown = function(event) {
        event.preventDefault();
        event.stopPropagation();

        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = true;

        /* Set correct position in config. */
        $scope.config.mouse.current.x = event.pageX;
        $scope.config.mouse.current.y = event.pageY;
        $scope.config.mouse.old.x = event.pageX;
        $scope.config.mouse.old.y = event.pageY;

        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseDown($scope, event);
    };

    /* This function is called when a mouse button is released. */
    $scope.mouseUp = function(event) {
        event.preventDefault();

        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = false;

        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp($scope, event);
    }
    
    $scope.mwheelUp = function() {
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        } else {
            $scope.config.canvas.zoom *= 1.1;
        }
        //console.log($scope.config.canvas.zoom);
    }

    $scope.mwheelDown = function() {
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        } else {
            $scope.config.canvas.zoom *= 0.9;
        }
        //console.log($scope.config.canvas.zoom);
    }

    /* Get the canvas element and start the engine. */
    $scope.startEngines(
        document.getElementById("main-canvas"),
        document.getElementById("editing-canvas")
    );

    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/logo.png";
    image1.onload = function(){$scope.newLayerFromImage(image1)};

    //TODO: nu tekenen we op de canvas, maar we moeten in de renderEngine tekenen o.i.d.
    //$scope.drawEngine = new Draw(canvas, $scope.renderEngine);
    //$scope.drawEngine.activate();
    //$scope.drawEngine.setBrush(brushType.THIN);
    //$scope.drawEngine.loadBrushSVG('assets/draw/thin.svg');
    //$scope.drawEngine.setDrawType(drawType.CIRCLE);
});
