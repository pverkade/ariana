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

    $scope.palette = {
        color: true,
        constants: true,
    }

    var palmousedown = false;
    var huemousedown = false;

    $scope.palette.constants = {
        palmousedown: false,
        huemousedown: false,
        pal: document.getElementById("palette"),
        hue: document.getElementById("hue"),
        palContext: palette.getContext('2d'),
        hueContext: hue.getContext('2d'),
        palBox: palette.getBoundingClientRect(),
        hueBox: hue.getBoundingClientRect(),
    }

    var palImg = new Image();
    palImg.src = "assets/img/bgGradient.png";

    var hueImg = new Image();
    hueImg.src = "assets/img/hueBar.png";

    hueImg.onload = function() {
        $scope.$watch('palette.color', function(newVal, oldVal) {
            if(newVal == true) {
                return;
            }
            rgb = HSVtoRGB(newVal.H, newVal.S, newVal.V);
            $scope.config.tools.colors.primary.r = rgb.R;
            $scope.config.tools.colors.primary.g = rgb.G;
            $scope.config.tools.colors.primary.b = rgb.B;
            $scope.palette.color.hex = RGBtoHEX(rgb.R, rgb.G, rgb.B);

            drawMarker(palImg);
            drawBar(hueImg);
        }, true);
    };

    /* init */
    $scope.init = function() {
        $scope.setCursor('default');

        hsv = RGBtoHSV( $scope.config.tools.colors.primary.r,
                        $scope.config.tools.colors.primary.g,
                        $scope.config.tools.colors.primary.b);

        hexcode = RGBtoHEX( $scope.config.tools.colors.primary.r,
                            $scope.config.tools.colors.primary.g,
                            $scope.config.tools.colors.primary.b);

        $scope.palette.color = {
            H: hsv.H,
            S: hsv.S,
            V: hsv.V,
            hex: hexcode,
        }
    };

    $scope.mouseDown = function() {

    };

    /* onMouseUp */
    $scope.mouseUp = function() {

    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        
    };

    $scope.palMouseDown = function(event) {
        updateSV(event);
        palmousedown = true;
    }

    $scope.palMouseMove = function(event) {
        if (palmousedown) {
            updateSV(event);
        }
    }

    $scope.palMouseUp = function() {
        palmousedown = false;
    }

    $scope.hueMouseDown = function(event) {
        updateH(event);
        huemousedown = true;
    };

    $scope.hueMouseMove = function(event) {
        if (huemousedown) {
            updateH(event);
        }
    }

    $scope.hueMouseUp = function() {
        huemousedown = false;
    }

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

    function updateSV(event) {
        $scope.palette.color.S = Math.floor(
            ((event.clientX - $scope.palette.constants.palBox.left)*100)/
            ($scope.palette.constants.palBox.right - $scope.palette.constants.palBox.left)
        );
        $scope.palette.color.V = Math.floor(
            100-((event.clientY - $scope.palette.constants.palBox.top)*100)/
            ($scope.palette.constants.palBox.bottom - $scope.palette.constants.palBox.top)
        );
    }

    function updateH(event) {
        $scope.palette.color.H = Math.floor(
            360-((event.clientY - $scope.palette.constants.hueBox.top)*360)/
            ($scope.palette.constants.hueBox.bottom - $scope.palette.constants.hueBox.top)
        );
    }

    function drawMarker(palImg) {
        context = $scope.palette.constants.palContext;
        context.clearRect(0, 0, $scope.palette.constants.pal.width, $scope.palette.constants.pal.height);
        context.drawImage(palImg, 0, 0);
        context.beginPath();
        locX =  $scope.palette.color.S * 
                ($scope.palette.constants.palBox.right - $scope.palette.constants.palBox.left)/100;
        locY =  (100 - $scope.palette.color.V) * 
                ($scope.palette.constants.palBox.bottom - $scope.palette.constants.palBox.top)/100;
        context.arc(locX,locY,5,0,2*Math.PI, false);
        context.fillStyle = "rgb("  + $scope.config.tools.colors.primary.r + "," 
                                    + $scope.config.tools.colors.primary.g + "," 
                                    + $scope.config.tools.colors.primary.b + ")";
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();
    }

    function drawBar(hueImg) {
        context = $scope.palette.constants.hueContext;
        context.clearRect(0, 0, $scope.palette.constants.hue.width, $scope.palette.constants.hue.height);
        context.drawImage(hueImg, 0, 0, $scope.palette.constants.hue.width, $scope.palette.constants.hue.height);
        context.beginPath();
        loc =   (360 - $scope.palette.color.H) * 
                ($scope.palette.constants.hueBox.bottom - $scope.palette.constants.hueBox.top)/360;
        context.rect(0, loc - 3, $scope.palette.constants.hueBox.right-$scope.palette.constants.hueBox.left, 6);
        context.fillStyle = "hsl(" + $scope.palette.color.H + ", 100%, 50%)";
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    }
});