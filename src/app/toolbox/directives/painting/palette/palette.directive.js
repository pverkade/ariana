app.directive('palette', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/palette/palette.tpl.html',
        controller: 'PaletteCtrl'
    };
});

app.controller('PaletteCtrl', function($scope) {
    $scope.toolname = 'palette'
    $scope.active = $scope.config.tools.activeTool == $scope.toolname;

    $scope.color = {
        H: 0,
        S: 0,
        V: 0
    }
    
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
        $scope.setCursor('default');

        $scope.color = RGBtoHSV($scope.config.tools.colors.primary.r,
                                $scope.config.tools.colors.primary.g,
                                $scope.config.tools.colors.primary.b);

        $scope.hex = RGBtoHEX($scope.config.tools.colors.primary.r,
                              $scope.config.tools.colors.primary.g,
                              $scope.config.tools.colors.primary.b);
                              
        $scope.drawMarker();
        $scope.drawBar();
    };

    $scope.mouseDown = function() {
    };

    $scope.mouseUp = function() {
    };

    $scope.mouseMove = function() {
    };

    $scope.paletteMouseDown = function(event) {
        $scope.selectingSaturationValue = true;
        $scope.paletteMouseMove(event);
    };
    
    $scope.paletteMouseUp = function() {
        $scope.selectingSaturationValue = false;
    };

    $scope.paletteMouseMove = function(event) {
        if ($scope.selectingSaturationValue) {
            /* Update the S and V value based on the mouse position inside the 
             * palette. */
            $scope.color.S = Math.floor(
                ((event.pageX - $scope.paletteBox.left) * 100) /
                ($scope.paletteBox.right - $scope.paletteBox.left)
            );
            $scope.color.V = Math.floor(
                100 - ((event.pageY - $scope.paletteBox.top) * 100) /
                ($scope.paletteBox.bottom - $scope.paletteBox.top)
            );
            
            $scope.drawMarker();
            $scope.drawBar();
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
            /* Update the H value based on the mouse position inside the 
             * hue bar. */
            $scope.color.H = Math.floor(
                360 - ((event.pageY - $scope.hueBox.top) * 360) /
                ($scope.hueBox.bottom - $scope.hueBox.top)
            );
            
            $scope.drawMarker();
            $scope.drawBar();
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

            $scope.config.tools.activeToolFunctions = {
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            };
        }
    }, true);
    
    
    $scope.updateRGB = function() {
        $scope.config.tools.colors.primary = HSVtoRGB($scope.color.H, $scope.color.S, $scope.color.V);

        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHSV = function() {
        $scope.color = RGBtoHSV($scope.config.tools.colors.primary.r, $scope.config.tools.colors.primary.g, $scope.config.tools.colors.primary.b);
        
        $scope.drawMarker();
        $scope.drawBar();
    };
    
    $scope.updateHEX = function() {
        $scope.hex = RGBtoHEX($scope.config.tools.colors.primary.r, $scope.config.tools.colors.primary.g, $scope.config.tools.colors.primary.b);
    };
    
    $scope.updateRGBfromHEX = function() {
        $scope.config.tools.colors.primary = HEXtoRGB($scope.hex);
    };

    $scope.drawMarker = function() {
        context = $scope.paletteContext;
        context.clearRect(0, 0, $scope.paletteBox.right - $scope.paletteBox.left, $scope.paletteBox.bottom - $scope.paletteBox.top);
        context.drawImage($scope.paletteImage, 0, 0);
        context.beginPath();
        locX =  $scope.color.S * 
                ($scope.paletteBox.right - $scope.paletteBox.left) / 100;
        locY =  (100 - $scope.color.V) * 
                ($scope.paletteBox.bottom - $scope.paletteBox.top) / 100;
        context.arc(locX, locY, 6, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb("  + $scope.config.tools.colors.primary.r + "," 
                                    + $scope.config.tools.colors.primary.g + "," 
                                    + $scope.config.tools.colors.primary.b + ")";
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
    }

    $scope.drawBar = function() {
        context = $scope.hueContext;
        context.clearRect(0, 0, $scope.hueBox.right - $scope.hueBox.left, $scope.hueBox.bottom - $scope.hueBox.top);
        context.drawImage($scope.hueImage , 0, 0, $scope.hueBox.right - $scope.hueBox.left, $scope.hueBox.bottom - $scope.hueBox.top);
        context.beginPath();
        loc =   (360 - $scope.color.H) * 
                ($scope.hueBox.bottom - $scope.hueBox.top)/360;
        context.rect(0, loc - 4, $scope.hueBox.right - $scope.hueBox.left, 8);
        context.fillStyle = "hsl(" + $scope.color.H + ", 100%, 50%)";
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
        $scope.config.tools.colors.primary.r = $scope.clamp($scope.config.tools.colors.primary.r, 0, 255);
        $scope.config.tools.colors.primary.g = $scope.clamp($scope.config.tools.colors.primary.g, 0, 255);
        $scope.config.tools.colors.primary.b = $scope.clamp($scope.config.tools.colors.primary.b, 0, 255);
        $scope.color.H = $scope.clamp($scope.color.H, 0, 360);
        $scope.color.S = $scope.clamp($scope.color.S, 0, 100);
        $scope.color.V = $scope.clamp($scope.color.V, 0, 100);
        while (!(/^#?[0-9A-F]{0,6}$/i.test($scope.hex))) {
            $scope.hex = $scope.hex.substr(0, $scope.hex.length-1);
        }
    }

    $scope.blur = function() {
        if (!$scope.config.tools.colors.primary.r) {
            $scope.config.tools.colors.primary.r = 0;
        }
        if (!$scope.config.tools.colors.primary.g) {
            $scope.config.tools.colors.primary.g = 0;
        }
        if (!$scope.config.tools.colors.primary.b) {
            $scope.config.tools.colors.primary.b = 0;
        }
        if (!$scope.color.H) {
            $scope.color.H = 0;
        }
        if (!$scope.color.S) {
            $scope.color.S = 0;
        }
        if (!$scope.color.V) {
            $scope.color.V = 0;
        }
        if ($scope.hex.charAt(0) == '#') {
            $scope.hex = $scope.hex + "#000000".substr($scope.hex.length, 7);
        } else {
            $scope.hex = '#' + $scope.hex + "000000".substr($scope.hex.length, 6);
        }
    }
});