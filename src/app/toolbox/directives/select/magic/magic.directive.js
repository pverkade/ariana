angular.module('ariana').directive('magic', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/magic/magic.tpl.html',
        controller: 'MagicCtrl'
    };
});

angular.module('ariana').controller('MagicCtrl', function($scope) {
	$scope.toolname = 'magic';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;

	$scope.threshold = 10;

	/* init */
	$scope.init = function() {
		$scope.setCursor('default');
	};

	/* onMouseDown */
	$scope.mouseDown = function() {

	};

	/* onMouseUp */
	$scope.mouseUp = function() {

	};

	/* onMouseMove */
	$scope.mouseMove = function() {
		
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
});