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

    /* This fucntion is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;

        $scope.config.mouse.current.x = (event.pageX - cx) / z;
        $scope.config.mouse.current.y = (event.pageY - cy) / z;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseMove($scope);      
    };

    /* This fucntion is triggered on a click. */
    $scope.mouseDown = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;
        
        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = true;
        
        /* Set correct position in config. */
        $scope.config.mouse.current.x = (event.pageX - cx) / z;
        $scope.config.mouse.current.y = (event.pageY - cy) / z;
        $scope.config.mouse.old.x = (event.pageX - cx) / z;
        $scope.config.mouse.old.y = (event.pageY - cy) / z;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseDown($scope);
    };
    
    /* This function is called when a mouse button is released. */
    $scope.mouseUp = function(event) {
        event.preventDefault();
        
        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = false;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp($scope);
    };
    
    $scope.mwheelUp = function() {
        if ($scope.config.canvas.zoom > 3.0) {
            $scope.config.canvas.zoom = 3.0;
        } else {
            $scope.config.canvas.zoom += 0.05;
        }
    };

    $scope.mwheelDown = function() {
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        } else {
            $scope.config.canvas.zoom -= 0.05;
        }
    };

    /* Get the canvas element and start the engine. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/logo.png";
    image1.onload = function(){$scope.newLayerFromImage(image1)};
});
