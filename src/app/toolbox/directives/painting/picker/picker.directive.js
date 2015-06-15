angular.module('ariana').directive('picker', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/picker/picker.tpl.html',
        controller: 'PickerCtrl'
    };
});

angular.module('ariana').controller('PickerCtrl', function($scope) {
    $scope.toolname = 'picker';
    $scope.active = $scope.config.tools.activeTool == $scope.toolname;

    /* init */
    $scope.init = function() {
        $scope.setCursor('crosshair');
        $scope.picking = false;
    };

    /* onMouseDown */
    $scope.mouseDown = function() {
        $scope.picking = true;
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.picking = false;
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        if (!$scope.picking) return;
         
        var x = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var y = $scope.config.mouse.current.y - $scope.config.canvas.y;
        
        var value = $scope.renderEngine.getPixelColor(x, y);
        
        /* Write color to config. */
        if ($scope.config.mouse.button[1]) {
            $scope.config.tools.colors.primary.r = value[0];
            $scope.config.tools.colors.primary.g = value[1];
            $scope.config.tools.colors.primary.b = value[2];
        }
        
        if ($scope.config.mouse.button[3]) {
            $scope.config.tools.colors.secondary.r = value[0];
            $scope.config.tools.colors.secondary.g = value[1];
            $scope.config.tools.colors.secondary.b = value[2];
        }
    };
-
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
        if (nval)  {
            $scope.init();

            $scope.config.tools.activeToolFunctions = {
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            };
        }
    }, true);
});