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
    $("#background").css("cursor", "grab");

    /* This fucntion is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();
        
        $scope.config.mouse.current.x = event.pageX;
        $scope.config.mouse.current.y = event.pageY;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseMove($scope);      
    };

    /* This fucntion is triggered on a click. */
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
    }
    
    $scope.mwheelUp = function() {
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        } else {
            $scope.config.canvas.zoom *= 1.1;
        }
        console.log($scope.config.canvas.zoom);
    }

    $scope.mwheelDown = function() {
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        } else {
            $scope.config.canvas.zoom *= 0.9;
        }
        console.log($scope.config.canvas.zoom);
    }

    /* Get the canvas element and start the engine. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/logo.png";
    image1.onload = function(){$scope.newLayerFromImage(image1)};
});
