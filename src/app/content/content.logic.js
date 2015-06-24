/* 
 * Project Ariana
 * content.logic.js
 * 
 * This file contains the ContenController, which controls the canvas in the
 * center of the screen.
 *
 */

/* The ContenController contains the behaviour of the main content. */
app.controller('ContentController', function($scope, $window) {

    /* This function is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;

        var mouseX, mouseY;
        if (event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].pageX;
            mouseY = event.originalEvent.touches[0].pageY;
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }
        $scope.config.mouse.current.x = (mouseX - cx) / z;
        $scope.config.mouse.current.y = (mouseY - cy) / z;
        
        $scope.config.mouse.current.global.x = mouseX;
        $scope.config.mouse.current.global.y = mouseY;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseMove();
    };

    /* This function is triggered on a click. */
    $scope.mouseDown = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;

        var mouseX, mouseY;
        if (event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].pageX;
            mouseY = event.originalEvent.touches[0].pageY;
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }

        /* Store the mouse button. */
        $scope.config.mouse.button[event.originalEvent.touches ? 1 : event.which] = true;

        /* Set correct position in config. */
        $scope.config.mouse.current.x = (mouseX - cx) / z;
        $scope.config.mouse.current.y = (mouseY - cy) / z;
        $scope.config.mouse.old.x     = (mouseX - cx) / z;
        $scope.config.mouse.old.y     = (mouseY - cy) / z;
        
        $scope.config.mouse.current.global.x = mouseX;
        $scope.config.mouse.current.global.y = mouseY;
        $scope.config.mouse.old.global.x = mouseX;
        $scope.config.mouse.old.global.y = mouseY;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseDown();
    };

    /* This function is called when a mouse button is released. */
    $scope.mouseUp = function(event) {
        event.preventDefault();

        /* Store the mouse button. */
        $scope.config.mouse.button[event.originalEvent.touches ? 1 : event.which] = false;

        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp();
    };

    $scope.mwheelUp = function() {
        $scope.config.canvas.zoom += 0.05;
        if ($scope.config.canvas.zoom >= 3.0) {
            $scope.config.canvas.zoom = 3.0;
            return;
        }
        
        /* Zoom on the current mouse location. */
        var widthDifference  = $scope.config.mouse.current.x * 0.05;
        var heightDifference = $scope.config.mouse.current.y * 0.05;
        
        $scope.config.canvas.x -= widthDifference;
        $scope.config.canvas.y -= heightDifference;
    };

    $scope.mwheelDown = function() {
        $scope.config.canvas.zoom -= 0.05;
        if ($scope.config.canvas.zoom <= 0.1) {
            $scope.config.canvas.zoom = 0.1;
            return;
        }

        /* Zoom on the current mouse location. */
        var widthDifference  = $scope.config.mouse.current.x * 0.05;
        var heightDifference = $scope.config.mouse.current.y * 0.05;
        
        $scope.config.canvas.x += widthDifference;
        $scope.config.canvas.y += heightDifference;
    };

    $scope.pinchZoom = function(event) {
        $scope.config.canvas.zoom += event.scale;
        if ($scope.config.canvas.zoom <= 0.1) {
            $scope.config.canvas.zoom = 0.1;
            return;
        }

        if ($scope.config.canvas.zoom >= 3.0) {
            $scope.config.canvas.zoom = 3.0;
            return;
        }
    };

    /* Get the canvas element and start the engine. */
    $scope.startEngines(
        document.getElementById("main-canvas"),
        document.getElementById("editing-canvas")
    );

    if (true) {
        var i = 1;
        function done() {
            if (i) {
                i--;
            }
            else {
                $scope.newLayerFromImage(img);
                $scope.newLayerFromImage(img2);
            }
        }
        $scope.resizeCanvases(800, 600);

        var img = document.createElement("img");
        img.width = 420;
        img.height = 320;
        img.src = "assets/img/snoop.jpg";
        img.onload = done;

        var img2 = document.createElement("img");
        img2.width = 250;
        img2.height = 250;
        img2.src = "assets/img/logo.png";
        img2.onload = done;

    }
});
