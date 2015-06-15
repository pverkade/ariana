var x_offset = 100;
var y_offset = 100;
// var offset = 0;
var tresholdValue = 30; /* Treshold value wordt geschaald, geef waarde tussen 1 en 100. */

app.controller('SelectionContentCtrl', function($scope, $interval) {


 	image.onload = function() {
		$scope.context.drawImage(image, x_offset, y_offset);
		imageData = $scope.context.getImageData(x_offset, y_offset, image.width, image.height);
		$scope.magic = new MagicSelection(imageData);
	};

 	$scope.mouseClick = function(e) {
 		x_rel = e.pageX - x_offset;
		y_rel = e.pageY - y_offset;

		if ($scope.magic.isInSelection(x_rel, y_rel)) {
			$scope.magic.removeSelection(x_rel, y_rel)
		} else {
			$scope.magic.getMaskWand(x_rel, y_rel, tresholdValue);
			$scope.magic.getMaskBorder();
		}

		// maskBorder = $scope.magic.getMaskBorder();
		newImageData = $scope.context.createImageData(image.width, image.height); 
		// $scope.magic.getImageBorders(newImageData);
		$scope.magic.getImageAnts(newImageData, 0);

		$scope.context.putImageData(newImageData, x_offset, y_offset);
	} 

	function callAtInterval() {
	    $scope.offset++;
		
		newImageData = $scope.context.createImageData(image.width, image.height); 
		// $scope.magic.getImageBorders(newImageData);
		$scope.magic.getImageAnts(newImageData, $scope.offset);

		$scope.context.putImageData(newImageData, x_offset, y_offset);
	}
});