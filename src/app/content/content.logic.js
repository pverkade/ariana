/* 
 * Project Ariana
 * content.logic.js
 * 
 * This file contains the ContenController, which controls the canvas in the
 * center of the screen.
 *
 */

/* The ContenController contains the behaviour of the main content. */
app.controller('ContentController', ["canvas", "mouse", "tools",
    function($scope, $window, canvas, mouse, tools) {

    /* This function is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();

        var cx = canvas.getX();
        var cy = canvas.getY();
        var zoom  = canvas.getZoom();

        var mouseX, mouseY;
        
        if (event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].pageX;
            mouseY = event.originalEvent.touches[0].pageY;
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }
        
        mouse.setPosX((mouseX - cx) / zoom);
        mouse.setPosY((mouseY - cy) / zoom);
        mouse.setGlobalPosX(mouseX);
        mouse.setGlobalPosY(mouseY);
        
        /* Call the appropriate tool functions. */
        var toolFunctions = tools.getToolFunctions;
        if (toolFunctions) {
            toolFunctions.mouseMove();
        }
    };

    /* This function is triggered on a click. */
    $scope.mouseDown = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var cx = canvas.getX();
        var cy = canvas.getY();
        var zoom  = canvas.getZoom();

        var mouseX, mouseY;
        if (event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].pageX;
            mouseY = event.originalEvent.touches[0].pageY;
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }

        /* Store the mouse button. */
        var mouseIndex = event.originalEvent.touches ? 1 : event.which;
        
        if (mouseIndex == 1) {
            mouse.setPrimary(true);
        }
        else if (mouseIndex == 2) {
            mouse.setMiddle(true);
        }
        else (mouseIndex == 3) {
            mouse.setSecondary(true);
        }

        /* Set correct position in config. */
        mouse.setPosX((mouseX - cx) / zoom);
        mouse.setPosY((mouseY - cy) / zoom);
        mouse.setGlobalPosX(mouseX);
        mouse.setGlobalPosY(mouseY);
        
        mouse.setOldPosX((mouseX - cx) / zoom);
        mouse.setOldPosY((mouseY - cy) / zoom);
        mouse.setOldGlobalPosX(mouseX);
        mouse.setOldGlobalPosY(mouseY);
        
        /* Call the appropriate tool functions. */
        var toolFunctions = tools.getToolFunctions;
        if (toolFunctions) {
            toolFunctions.mouseDown();
        }
    };

    /* This function is called when a mouse button is released. */
    $scope.mouseUp = function(event) {
        event.preventDefault();

        /* Store the mouse button. */
        var mouseIndex = event.originalEvent.touches ? 1 : event.which;
        
        if (mouseIndex == 1) {
            mouse.setPrimary(false);
        }
        else if (mouseIndex == 2) {
            mouse.setMiddle(false);
        }
        else (mouseIndex == 3) {
            mouse.setSecondary(false);
        }

        /* Call the appropriate tool functions. */
        var toolFunctions = tools.getToolFunctions;
        if (toolFunctions) {
            toolFunctions.mouseUp();
        }
    };

    $scope.mwheelUp = function() {
        var zoom = canvas.getzoom() + 0.05;
        if (zoom >= 3.0) {
            zoom = 3.0;
            canvas.setZoom(zoom);
            return;
        }
        canvas.setZoom(zoom);
        
        /* Zoom on the current mouse location. */
        var widthDifference  = mouse.getPosX() * 0.05;
        var heightDifference = mouse.getPosY() * 0.05;
        
        canvas.setX(canvas.getX() - widthDifference);
        canvas.setY(canvas.getY() - heightDifference);
    };

    $scope.mwheelDown = function() {
        var zoom = canvas.getzoom() - 0.05;
        if (zoom <= 0.05) {
            zoom = 0.05;
            canvas.setZoom(zoom);
            return;
        }
        canvas.setZoom(zoom);

        /* Zoom on the current mouse location. */
        var widthDifference  = mouse.getPosX() * 0.05;
        var heightDifference = mouse.getPosY() * 0.05;
        
        canvas.setX(canvas.getX() + widthDifference);
        canvas.setY(canvas.getY() + heightDifference);
    };

    $scope.pinchZoom = function(event) {
        var zoom = canvas.getZoom() + event.scale;
        if (zoom <= 0.05) {
            zoom = 0.05;
            canvas.setZoom(zoom);
            return;
        }

        if (zoom >= 3.0) {
            zoom = 3.0;
            canvas.setZoom(zoom);
            return;
        }
        
        canvas.setZoom(zoom);
    };

    /* Get the canvas element and start the engine. */
    $scope.startEngines(
        document.getElementById("main-canvas"),
        document.getElementById("editing-canvas")
    );
}]);
