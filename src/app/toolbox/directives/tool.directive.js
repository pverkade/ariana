app.directive('tool', ['tools', function(tools) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {

            scope.expanded = true;

            element.bind('click', function(event) {
                event.stopPropagation();
                tools.setTool(scope.toolname);

                if (event.target.className.indexOf('mdi') > -1) {
                    scope.expanded = !scope.expanded;
                    scope.$apply(scope.expanded);
                }

                scope.$apply(tools.getTool());
            });

            function getTool() {
                return tools.getTool();
            }

            scope.$watch(getTool, function(nval, oval) {
                scope.active = (nval == scope.toolname);

                if (!scope.active) scope.expanded = false;
            }, true);
        }
    };
}]);