/* 
 * Project Ariana
 * palette.directive.js
 * 
 * This file contains the PaletteController and directive, 
 * which control the palette in the toolbox.
 *
 */

app.directive('palette', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/palette/palette.tpl.html',
        controller: 'PaletteCtrl'
    };
});

app.controller('PaletteCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', 'colors', function($scope, tools, canvas, layers, mouse, colors) {

    $scope.toolname = 'palette';
    $scope.active = tools.getTool() == $scope.toolname;

    $scope.color = {
        h: 0,
        s: 0,
        v: 0
    };
    
    $scope.hex = "#000000";

    $scope.selectingSaturationValue = false;
    $scope.selectingHue = false;
    
    $scope.palette = document.getElementById("palette");
    $scope.hue = document.getElementById("hue");
    $scope.paletteContext = $scope.palette.getContext('2d');
    $scope.hueContext = $scope.hue.getContext('2d');
    $scope.paletteBox = $scope.palette.getBoundingClientRect();
    $scope.hueBox = $scope.hue.getBoundingClientRect();

    $scope.paletteImage = new Image();
    $scope.paletteImage.src = "assets/img/bgGradient.png";
    /* Create canvas from image */
    $scope.paletteImage.onload = function() {
        $scope.paletteOverlay = document.createElement('canvas');
        $scope.paletteOverlay.width = $scope.palette.width;
        $scope.paletteOverlay.height = $scope.palette.height;
        $scope.paletteOverlayContext = $scope.paletteOverlay.getContext('2d');
        $scope.paletteOverlayContext.drawImage($scope.paletteImage, 0, 0);
    }
    
    $scope.hueImage = new Image();
    $scope.hueImage.src = "assets/img/hueBar.png";
    /* Create canvas from image */
    $scope.hueImage.onload = function() {
        $scope.hueOverlay = document.createElement('canvas');
        $scope.hueOverlay.width = $scope.hue.width;
        $scope.hueOverlay.height = $scope.hue.height;
        $scope.hueOverlayContext = $scope.hueOverlay.getContext('2d');
        $scope.hueOverlayContext.drawImage($scope.hueImage, 0, 0, $scope.hue.width, $scope.hue.height);
    }

    /* init */
    $scope.init = function() {
        canvas.setCursor('default');

        $scope.color = rgbToHsv(colors.getPrimary());

        $scope.hex = rgbToHex(colors.getPrimary());
                              
        $scope.drawMarker();
        $scope.drawBar();
    };

    $scope.mouseDown = function() {
    };

    $scope.mouseUp = function() {
    };

    $scope.mouseMove = function() {
    };

    $scope.$on('swapColorsBC', function () {
         $scope.updateHsv();
         $scope.updateHex();
    });

    $scope.paletteMouseDown = function(event) {
        $scope.selectingSaturationValue = true;
        $scope.paletteMouseMove(event);
    };
    
    $scope.paletteMouseUp = function() {
        $scope.selectingSaturationValue = false;
    };

    $scope.paletteMouseMove = function(event) {
        if ($scope.selectingSaturationValue) {
            var locX, locY;

            /* Update the S and V value based on the mouse position inside the 
             * palette. */

            /* Discriminate mouse inputs and touch inputs */
            if (/^mouse/i.test(event.type)) {
                locX = event.pageX;
                locY = event.pageY;
            } else {
                locX = event.originalEvent.touches[0].pageX;
                locY = event.originalEvent.touches[0].pageY;
            }

            if (locX < $scope.paletteBox.left) {
                locX = $scope.paletteBox.left;
            }
            if (locY < $scope.paletteBox.top) {
                locY = $scope.paletteBox.top;
            }            
            if (locX > $scope.paletteBox.right) {
                locX = $scope.paletteBox.right;
            }
            if (locY > $scope.paletteBox.bottom) {
                locY = $scope.paletteBox.bottom;
            }

            $scope.color.s = Math.floor(
                ((locX - $scope.paletteBox.left) * 100) / $scope.palette.width
            );
            $scope.color.v = Math.floor(
                100 - ((locY - $scope.paletteBox.top) * 100) / $scope.palette.height
            );

            $scope.updateRgb();
            $scope.updateHex();
        }
    };

    $scope.hueMouseDown = function(event) {
        $scope.selectingHue= true;
        $scope.hueMouseMove(event);
    };
    
    $scope.hueMouseUp = function() {
        $scope.selectingHue = false;
    };

    $scope.hueMouseMove = function(event) {
        if ($scope.selectingHue) {
            var locY;

            /* Update the H value based on the mouse position inside the 
             * hue bar. */
            if (/^mouse/i.test(event.type)) {
                locY = event.pageY;
            } else {
                locY = event.originalEvent.touches[0].pageY;
            }

            if (locY < $scope.hueBox.top) {
                locY = $scope.hueBox.top;
            }
            if (locY > $scope.hueBox.bottom) {
                locY = $scope.hueBox.bottom;
            }
            

            $scope.color.h = Math.floor(
                360 - ((locY - $scope.hueBox.top) * 360) /
                ($scope.hueBox.bottom - $scope.hueBox.top)
            );
            
            $scope.updateRgb();
            $scope.updateHex();
        }
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
    $scope.$watch('active', function(nval) {
        if (nval) {
            $scope.init();

            tools.setToolFunctions({
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            });
        }
    }, true);
    
    
    $scope.updateRgb = function() {
        colors.setPrimaryRgb(hsvToRgb($scope.color));

        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHsv = function() {
        $scope.color = rgbToHsv(colors.getPrimary());
        
        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHex = function() {
        $scope.hex = rgbToHex(colors.getPrimary());
    };
    
    $scope.updateRgbFromHex = function() {
        colors.setPrimaryRgb(hexToRgb($scope.hex));
    };

    $scope.drawMarker = function() {
        var width = $scope.palette.width;
        var height = $scope.palette.height;
        context = $scope.paletteContext;
        context.clearRect(0, 0, width, height);
        /* Draw canvas instead of image */
        context.drawImage($scope.paletteOverlay, 0, 0);
        context.beginPath();
        locX =  $scope.color.s * width / 100;
        locY =  (100 - $scope.color.v) * height / 100;
        context.arc(locX, locY, 6, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb(" + colors.getPrimaryR() + "," +
                                     colors.getPrimaryG() + "," +
                                     colors.getPrimaryB() + ")";
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
    };

    $scope.drawBar = function() {
        var width = $scope.hue.width;
        var height = $scope.hue.height;
        context = $scope.hueContext;
        context.clearRect(0, 0, width, height);
        /* Draw canvas instead of image */
        context.drawImage($scope.hueOverlay, 0, 0);
        context.beginPath();
        loc =   (360 - $scope.color.h) * height / 360;
        context.rect(0, loc - 4, width, 8);
        context.fillStyle = "hsl(" + $scope.color.h + ", 100%, 50%)";
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
    };

    $scope.clamp = function(num, min, max) {
        if (num === null || num === undefined) {
            return null;
        } else if (num < min) {
            return min;
        } else if (num > max) {
            return max;
        } else {
            return Math.round(num);
        }
    };

    $scope.validate = function() {
        color.setPrimaryR($scope.clamp(colors.getPrimaryR(), 0, 255));
        color.setPrimaryG($scope.clamp(colors.getPrimaryG(), 0, 255));
        color.setPrimaryB($scope.clamp(colors.getPrimaryB(), 0, 255));
        $scope.color.h = $scope.clamp($scope.color.h, 0, 360);
        $scope.color.s = $scope.clamp($scope.color.s, 0, 100);
        $scope.color.v = $scope.clamp($scope.color.v, 0, 100);
        while (!(/^#?[0-9A-F]{0,6}$/i.test($scope.hex))) {
            $scope.hex = $scope.hex.substr(0, $scope.hex.length-1);
        }
    };

    $scope.blur = function() {
        if (!colors.getPrimaryR()) {
            color.setPrimaryR(0);
        }
        if (!colors.getPrimaryG()) {
            color.setPrimaryG(0);
        }
        if (!colors.getPrimaryB()) {
            color.setPrimaryB(0);
        }
        if (!$scope.color.h) {
            $scope.color.h = 0;
        }
        if (!$scope.color.s) {
            $scope.color.s = 0;
        }
        if (!$scope.color.v) {
            $scope.color.v = 0;
        }
        if ($scope.hex.charAt(0) == '#') {
            $scope.hex = $scope.hex + "#000000".substr($scope.hex.length, 7);
        } else {
            $scope.hex = '#' + $scope.hex + "000000".substr($scope.hex.length, 6);
        }
    };
}]);
