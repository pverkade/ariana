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

	hsv = RGBtoHSV(	$scope.config.tools.colors.primary.r,
            		$scope.config.tools.colors.primary.g,
            		$scope.config.tools.colors.primary.b)

	$scope.color = {
        H: hsv.H,
        S: hsv.S,
        V: hsv.V,
        hex: "#000000",
    }

    var palmousedown = false;
	var huemousedown = false;

    var palette = document.getElementById("palette");
    var hue = document.getElementById("hue");

    var palContext = palette.getContext('2d');
    var hueContext = hue.getContext('2d');

    var palBox = palette.getBoundingClientRect();
    var hueBox = hue.getBoundingClientRect();

    var palImg = new Image();
    palImg.src = "assets/img/bgGradient.png";

    var hueImg = new Image();
    hueImg.src = "assets/img/hueBar.png";

    hueImg.onload = function() {
        $scope.$watch('color', function(newVal, oldVal) {
            rgb = HSVtoRGB(newVal.H, newVal.S, newVal.V);
            $scope.config.tools.colors.primary.r = rgb.R;
            $scope.config.tools.colors.primary.g = rgb.G;
            $scope.config.tools.colors.primary.b = rgb.B;
            $scope.color.hex = RGBtoHEX(rgb.R, rgb.G, rgb.B);

            drawMarker(palette, palBox, palContext, palImg);
            drawBar(hue, hueBox, hueContext, hueImg);
        }, true);
    };

	/* init */
	$scope.init = function() {
		$scope.setCursor('default');
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
        $scope.color.S = Math.floor((event.offsetX*100)/(palBox.right - palBox.left));
        $scope.color.V = Math.floor(100-(event.offsetY*100)/(palBox.bottom - palBox.top));
    }

    function updateH(event) {
        $scope.color.H = Math.floor(360-(event.offsetY*360)/(hueBox.bottom - hueBox.top));
    }

    function drawMarker(palette, palBox, palContext, palImg) {
        palContext.clearRect(0, 0, palette.width, palette.height);
        palContext.drawImage(palImg, 0, 0);
        palContext.beginPath();
        locX = $scope.color.S * (palBox.right - palBox.left)/100;
        locY = (100 - $scope.color.V) * (palBox.bottom - palBox.top)/100;
        palContext.arc(locX,locY,5,0,2*Math.PI, false);
        palContext.fillStyle = "rgb("  + $scope.config.tools.colors.primary.r + "," 
                                    + $scope.config.tools.colors.primary.g + "," 
                                    + $scope.config.tools.colors.primary.b + ")";
        palContext.fill();
        palContext.lineWidth = 2;
        palContext.strokeStyle = "black";
        palContext.stroke();
        palContext.lineWidth = 1;
        palContext.strokeStyle = "white";
        palContext.stroke();
    }

    function drawBar(hue, hueBox, hueContext, hueImg) {
        hueContext.clearRect(0, 0, hue.width, hue.height);
        hueContext.drawImage(hueImg, 0, 0, hue.width, hue.height);
        hueContext.beginPath();
        loc = (360 - $scope.color.H) * (hueBox.bottom - hueBox.top)/360;
        hueContext.rect(0, loc - 3, hueBox.right-hueBox.left, 6);
        hueContext.fillStyle = "hsl(" + $scope.color.H + ", 100%, 50%)";
        hueContext.fill();
        hueContext.lineWidth = 2;
        hueContext.strokeStyle = "black";
        hueContext.stroke();
    }
});