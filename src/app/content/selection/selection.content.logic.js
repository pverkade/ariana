var magic = new MagicSelection(); ;
var bitmask;
var bitmaskAnts;
var imageData;
var canvas;
var context;
var x_offset = 100;
var y_offset = 100;
var offset = 0;
var width = 256;
var height = 256;
var x_magic = 70;
var y_magic = 66;
var tresholdValue = 30; /* Treshold value wordt geschaald, geef waarde tussen 1 en 100. */

angular.module('ariana').controller('SelectionContentCtrl', function($scope, $interval) {

	$scope.mouseClick = function(e) {
		console.log(e.pageX + ", " + e.pageY);
		bitmask = magic.getSelection(imageData, e.pageX - x_offset, e.pageY - y_offset, tresholdValue, 1);
		bitmaskAnts = magic.marchingAnts(offset % 8);
	}

    setCanvasSize();
    var image = new Image();
    image.src = "assets/wall.png";

    canvas = document.getElementById('main-canvas');
    context = canvas.getContext('2d');

    $interval(callAtInterval, 1000);

	image.onload = function() {
		context.drawImage(image, x_offset, y_offset);
		imageData = context.getImageData(x_offset, y_offset, width, height);

		// magic = new MagicSelection();
		// bitmask = magic.getSelection(imageData, x_magic, y_magic, tresholdValue, 1);

		// for (var i=0; i < bitmask.length; i++) {
		// 	if (bitmask[i] != 0) {
		// 		imageData.data[4*i] = 255;
		// 		imageData.data[4*i+1] = 255;
		// 		imageData.data[4*i+2] = 255;
		// 		imageData.data[4*i+3] = 255;
		// 	}
		// }

		// context.putImageData(imageData,width,0);
		// callAtInterval()
	};

	function callAtInterval() {
		if (magic != null && magic.bitmaskData != []) {
			bitmaskAnts = magic.marchingAnts(offset % 8);

			for (var i=0; i < bitmask.length; i++) {
				if (bitmask[i] != 0) {
					if (bitmaskAnts[i] != 0) {
						imageData.data[4*i] = 0;
						imageData.data[4*i+1] = 0;
						imageData.data[4*i+2] = 0;
						imageData.data[4*i+3] = 255;
					} else {
						imageData.data[4*i] = 255;
						imageData.data[4*i+1] = 255;
						imageData.data[4*i+2] = 255;
						imageData.data[4*i+3] = 255;
					}
				}
			}

			context.putImageData(imageData, x_offset, y_offset);
			offset++; 			
		}
	}     
});



/* This function sets the canvas full screen. It uses the fact that hdpi 
screen require a larger canvas size. */
function setCanvasSize() {
    var canvas = document.getElementById('main-canvas');
    var desiredWidthInCSSPixels  = window.innerWidth;
    var desiredHeightInCSSPixels = window.innerHeight;
    
    canvas.style.width  = desiredWidthInCSSPixels  + "px";
    canvas.style.height = desiredHeightInCSSPixels + "px";
    
    var devicePixelRatio = window.devicePixelRatio || 1;
    
    canvas.width  = desiredWidthInCSSPixels  * devicePixelRatio;
    canvas.height = desiredHeightInCSSPixels * devicePixelRatio;  
}