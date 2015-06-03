angular.module('ariana').controller('contentCtrl', function($scope) {
    setCanvasSize();
    var image = new Image();
    image.src = "assets/image.png";

    var canvas = document.getElementById('main-canvas');
    var context = canvas.getContext('2d');

	image.onload = function() {
		context.drawImage(image, 50, 50);
		var imageData = context.getImageData(50, 50, 201, 201);

		var magic = new MagicSelection();
		var bitmask = magic.getSelection(imageData, 43, 100, 0.125);

		console.log(bitmask.length);
		console.log(bitmask);
		console.log(imageData.data.length);


		for (var i=0; i < bitmask.length; i++) {
			if (bitmask[i] != 0) {
				imageData.data[4*i] = 0;
				imageData.data[4*i+1] = 0;
				imageData.data[4*i+2] = 0;
				imageData.data[4*i+3] = 0;
				console.log("bitmask ongelijk aan 0");
			} else {
				imageData.data[4*i] = 255;
				imageData.data[4*i+1] = 255;
				imageData.data[4*i+2] = 255;
				imageData.data[4*i+3] = 255;
			}
		}

		context.putImageData(imageData,400,50);
		console.log(magic);
		console.log(image);
	};

	// for (var i = 0; i < imageData.data.length; i++) {
	// 	imageData.data[i] = 255;
	// }

	// console.log(imageData);
	// context.putImageData(imageData, 400, 100);


	// console.log(image);
	// var imageObj = new Image();
	// imageObj.onload = function() {
	// 	context.drawImage(imageObj, 69, 50);
	//};
	//imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
    // context.drawImage(image, 100, 100);
    // console.log(image);
    // TODO set resize canvas on resize
    
    // TODO set resize canvas on orientation change 
    
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
