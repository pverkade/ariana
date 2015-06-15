app.directive('tool', function() {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {

			scope.expanded = false;

			element.bind('click', function(event) {
				event.stopPropagation();
				console.log(event);
				scope.config.tools.activeTool = scope.toolname;

				if (event.target.className.indexOf('mdi') > -1) {
					scope.expanded = !scope.expanded;
				}

				scope.$apply();
			});

			scope.$watch('config.tools.activeTool', function(newValue, oldValue) {
				scope.active = scope.config.tools.activeTool == scope.toolname;
			}, true);
		}
	}
});