app.directive('tool', function() {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			element.bind('click', function(event) {
				event.stopPropagation();
				scope.config.tools.activeTool = scope.toolname;
				scope.$apply();
			});

			scope.$watch('config.tools.activeTool', function(newValue, oldValue) {
				scope.active = scope.config.tools.activeTool == scope.toolname;
			}, true);
		}
	}
});