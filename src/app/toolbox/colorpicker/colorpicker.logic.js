app.controller("ColorpickerCtrl", ['$scope',
    function($scope) {
        $scope.color = {
            R: 0,
            G: 255,
            B: 255,
            H: 180,
            S: 100,
            V: 100,
            hex: "#000000",
        }

        var palmousedown = false;
        var huemousedown = false;

        /* get elements */
        var palette = document.getElementById("palette");
        var hue = document.getElementById("hue");

        /* get contexts */
        palContext = palette.getContext('2d');
        hueContext = hue.getContext('2d');

        /* get bounding boxes */
        palBox = palette.getBoundingClientRect();
        hueBox = hue.getBoundingClientRect();

        var palImg = new Image();
        palImg.src = "assets/img/bgGradient.png";

        var hueImg = new Image();
        hueImg.src = "assets/img/hueBar.png";

        hueImg.onload = function() {
            //palContext.drawImage(palImg, 0, 0);
            //hueContext.drawImage(hueImg, 0, 0, hue.width, hue.height);
            
            //var stopRecursion;
            $scope.$watch('color', function(oldVal, newVal) {
                rgb = HSVtoRGB(newVal.H, newVal.S, newVal.V);
                    $scope.color.R = rgb.R;
                    $scope.color.G = rgb.G;
                    $scope.color.B = rgb.B;
                /*if ((oldVal.H != newVal.H || oldVal.S != newVal.S || oldVal.V != newVal.V)) {
                    rgb = HSVtoRGB(newVal.H, newVal.S, newVal.V);
                    $scope.color.R = rgb.R;
                    $scope.color.G = rgb.G;
                    $scope.color.B = rgb.B;
                    //console.log("rgb: ", rgb);
                } else if ((oldVal.R != newVal.R || oldVal.G != newVal.G || oldVal.B != newVal.B)) {
                    hsv = RGBtoHSV(newVal.R, newVal.G, newVal.B);
                    $scope.color.H = hsv.H;
                    $scope.color.S = hsv.S;
                    $scope.color.V = hsv.V;
                    //console.log("hsv: ", hsv);
                };
                stopRecursion = angular.copy(newVal);
                console.log("old: ", oldVal, " new: ", newVal);*/
                drawMarker(palette, palBox, palContext, palImg);
                drawBar(hue, hueBox, hueContext, hueImg);
            }, true);
        };

        $scope.palMouseDown = function(event) {
            updateSV(event);
            palmousedown = true;
            console.log('hi', palmousedown);
        }

        $scope.palMouseMove = function(event) {
            console.log('mousemove', palmousedown);
            if (palmousedown) {
                updateSV(event);
            }
        }

        $scope.palMouseUp = function() {
            palmousedown = false;
            console.log('mouseup', palmousedown);
        }

        function updateSV(event) {
            $scope.color.S = Math.floor((event.offsetX*100)/(palBox.right - palBox.left));
            $scope.color.V = Math.floor(100-(event.offsetY*100)/(palBox.bottom - palBox.top));
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

        function updateH(event) {
            $scope.color.H = Math.floor(360-(event.offsetY*360)/(hueBox.bottom - hueBox.top));
        }

        /* draw marker on palette */
        function drawMarker(palette, box, context, palImg, S, V) {
            context.clearRect(0, 0, palette.width, palette.height);
            //palette.style.background = "hsl(" + H + ",100%, 50%)";
            context.drawImage(palImg, 0, 0);
            context.beginPath();
            //loc = $scope.color.S, $scope.color.V;
            locX = $scope.color.S * (box.right - box.left)/100;
            locY = (100 - $scope.color.V) * (box.bottom - box.top)/100;
            //context.arc(loc.x,loc.y,5,0,2*Math.PI, false);
            context.arc(locX,locY,5,0,2*Math.PI, false);
            //console.log($scope.color.S, locX);
            context.fillStyle = "rgb(" + $scope.color.R + "," + $scope.color.G + "," + $scope.color.B + ")";
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = "white";
            context.stroke();
        }

        function drawBar(hue, box, context, hueImg, H) {
            //context = hue.getContext("2d");
            context.clearRect(0, 0, hue.width, hue.height);
            context.drawImage(hueImg, 0, 0, hue.width, hue.height);
            context.beginPath();
            loc = (360 - $scope.color.H) * (box.bottom - box.top)/360;
            //context.rect(0,loc.z,box.right-box.left,6);
            context.rect(0,loc - 3,box.right-box.left,6);
            //console.log(loc, $scope.color.H);
            context.fillStyle = "hsl(" + $scope.color.H + ", 100%, 50%)";
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.stroke();
        }

        //console.log('hi');
    }
]);