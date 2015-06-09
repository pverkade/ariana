angular.module('ariana').controller('layersCtrl', function($scope) {
	$scope.addLayer = function() {
		$scope.config.layers.layerInfo.push({"x": 0, "y": 0, "scale": 1});
	}

	$scope.removeLayer = function(event, index) {
		event.stopPropagation();
		console.log(index);
		$scope.config.layers.layerInfo.splice(index, 1);
	}
});