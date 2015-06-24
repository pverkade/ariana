/* 
 * Project Ariana
 * picker.directive.js
 * 
 * This file contains the PickerController and directive, 
 * which control the eyedrop tool in the toolbox.
 *
 */
 
app.directive('picker', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/picker/picker.tpl.html',
        controller: 'PickerCtrl'
    };
});

app.controller('PickerCtrl', ['$scope', 'tools', 'canvas', 'mouse', 'colors',
    function($scope, tools, canvas, mouse, color) {
        
    $scope.toolname = 'picker';
    $scope.active = tools.getTool() == $scope.toolname;

    /* init */
    $scope.init = function() {
        canvas.setCursor('crosshair');
        $scope.picking = false;
    };

    /* onMouseDown */
    $scope.mouseDown = function() {
        $scope.picking = true;
        $scope.mouseMove();
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.picking = false;
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        if (!$scope.picking) return;
         
        var x = Math.round(mouse.getPosX());
        var y = Math.round(mouse.getPosY());
        
        var value = $scope.renderEngine.getPixelColor(x, y);
        
        /* Write color to config. */
        if (mouse.getPrimary()) {
            colors.setPrimaryR(value[0]);
            colors.setPrimaryG(value[1]);
            colors.setPrimaryB(value[2]);
        }
        
        if (mouse.getSecondary()) {
            colors.setSecondaryR(value[0]);
            colors.setSecondaryG(value[1]);
            colors.setSecondaryB(value[2]);
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

            tools.setToolFunctions({
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            });
        }
    }, true);
}]);