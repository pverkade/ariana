app.directive('tool', function() {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {

			scope.expanded = true;

			element.bind('click', function(event) {
				event.stopPropagation();
				scope.config.tools.activeTool = scope.toolname;

				//if (event.target.className.indexOf('mdi') > -1) {
					scope.expanded = !scope.expanded;
					scope.$apply(scope.expanded);
				//}

				scope.$apply(scope.config.tools.activeTool);
			});

			scope.$watch('config.tools.activeTool', function(newValue, oldValue) {
				scope.active = scope.config.tools.activeTool == scope.toolname;

				if (!scope.active) scope.expanded = false;
			}, true);
		}
	}
});