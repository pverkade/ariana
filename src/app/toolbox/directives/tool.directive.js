app.directive('tool', ['tools', function(tools) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {

			scope.expanded = true;

			element.bind('click', function(event) {
				event.stopPropagation();
				tools.setActiveTool(scope.toolname);

				if (event.target.className.indexOf('mdi') > -1) {
					scope.expanded = !scope.expanded;
					scope.$apply(scope.expanded);
				}

				scope.$apply(tools.getActiveTool);
			});

			scope.$watch('config.tools.activeTool', function(newValue, oldValue) {
				scope.active = (tools.getActiveTool == scope.toolname);

				if (!scope.active) scope.expanded = false;
			}, true);
		}
	}
});