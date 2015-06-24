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
    
    $scope.hueImage = new Image();
    $scope.hueImage.src = "assets/img/hueBar.png";
    
    /* init */
    $scope.init = function() {
        canvas.setCursor('default');

        $scope.color = RGBtoHSV(colors.getPrimary());

        $scope.hex = RGBtoHEX(colors.getPrimary());
                              
        $scope.drawMarker();
        $scope.drawBar();
    };

    $scope.mouseDown = function() {
    };

    $scope.mouseUp = function() {
    };

    $scope.mouseMove = function() {
    };

    $scope.$on('swapColorsBC', function (event, data) {
         $scope.updateHSV();
         $scope.updateHEX();
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

            $scope.updateRGB();
            $scope.updateHEX();
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
            
            $scope.updateRGB();
            $scope.updateHEX();
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
    $scope.$watch('active', function(nval, oval) {
        if (nval) {
            $scope.init();

            tools.setToolFunctions({
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            });
        }
    }, true);
    
    
    $scope.updateRGB = function() {
        colors.setPrimaryRGB(HSVtoRGB($scope.color));

        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHSV = function() {
        $scope.color = RGBtoHSV(colors.getPrimary());
        
        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHEX = function() {
        $scope.hex = RGBtoHEX(colors.getPrimary());
    };
    
    $scope.updateRGBfromHEX = function() {
        colors.setPrimaryRGB(HEXtoRGB($scope.hex));
    };

    $scope.drawMarker = function() {
        var width = $scope.palette.width;
        var height = $scope.palette.height;
        context = $scope.paletteContext;
        context.clearRect(0, 0, width, height);
        context.drawImage($scope.paletteImage, 0, 0, width, height);
        context.beginPath();
        locX =  $scope.color.s * width / 100;
        locY =  (100 - $scope.color.v) * height / 100;
        context.arc(locX, locY, 6, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb("  + colors.getPrimaryR() + "," 
                                    + colors.getPrimaryG() + "," 
                                    + colors.getPrimaryB() + ")";
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
    }

    $scope.drawBar = function() {
        var width = $scope.hue.width;
        var height = $scope.hue.height;
        context = $scope.hueContext;
        context.clearRect(0, 0, width, height);
        context.drawImage($scope.hueImage , 0, 0, width, height);
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
    }

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
    }

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
    }
}]);