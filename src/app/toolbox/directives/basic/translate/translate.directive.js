app.directive('translate', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/translate/translate.tpl.html',
        controller: 'TranslateCtrl'
    };
});

app.controller('TranslateCtrl', function($scope) {
    $scope.toolname = 'translate';
    $scope.active = $scope.config.tools.activeTool == $scope.toolname;

    /* init */
    $scope.init = function() {
        $scope.setCursor('move');
        $scope.translating = false;
    };

    /* onMouseDown */
    $scope.mouseDown = function() {
        $scope.translating = true;
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.translating = false;
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        if (!$scope.translating) return;
         
        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) return;
        var layer = $scope.renderEngine.layers[currentLayer];
        
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.old.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.old.y;
        
        /* Update th old mouse position. */
        $scope.config.mouse.old.x += dx;
        $scope.config.mouse.old.y += dy;
        
        /* Get the layer position. */
        var x = layer.getPosX();
        var y = layer.getPosY();

        layer.setPos(x + dx, y + dy);
        $scope.editEngine.drawTranslateTool(layer);
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});  
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
        if (nval)  {
            $scope.init();

            $scope.config.tools.activeToolFunctions = {
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            };
        } else {
            $scope.editEngine.clear();
        }
    }, true);
});