/* 
 * Project Ariana
 * translate.directive.js
 * 
 * This file contains the TranslateController and directive, 
 * which control the translate tool in the toolbox.
 *
 */
 
app.directive('translate', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/translate/translate.tpl.html',
        controller: 'TranslateCtrl'
    };
});

app.controller('TranslateCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', function($scope, tools, canvas, layers, mouse) {
    $scope.toolname = 'translate';
    $scope.active = tools.getTool() == $scope.toolname;

    /* init */
    $scope.init = function() {
        canvas.setCursor('move');
        $scope.translating = false;
        
        var currentLayer = layers.getCurrentIndex();
        if (currentLayer == -1) return;

        var layer = $scope.renderEngine.layers[currentLayer];
        $scope.editEngine.drawTranslateTool(layer);
        window.requestAnimationFrame(function() {$scope.renderEngine.render();});  
    };

    /* onMouseDown */
    $scope.mouseDown = function() {
        $scope.translating = true;
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.translating = false;
        $scope.updateThumbnail(layers.getCurrentIndex());
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        if (!$scope.translating) return;
         
        var currentLayer = layers.getCurrentIndex();
        if (currentLayer == -1) return;
        var layer = $scope.renderEngine.layers[currentLayer];
        
        var dx = mouse.getPosGlobal().x - mouse.getPosOldGlobal().x;
        var dy = mouse.getPosGlobal().y - mouse.getPosOldGlobal().y;
        
        /* Update the old mouse position. */
        mouse.setPosOld(mouse.getPosOld().x + dx, mouse.getPosOld().y + dy);
        
        /* Get the layer position. */
        var x = layer.getPosX();
        var y = layer.getPosY();

        layer.setPos(x + dx, y + dy);
        $scope.requestRenderEngineUpdate();

        $scope.editEngine.setEditLayer(layer, EditMode.translate);
        $scope.requestEditEngineUpdate();
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
    $scope.$watch('active', function(nval) {
        if (nval)  {
            $scope.init();

            tools.setToolFunctions({
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            });
        }
        else {
            $scope.editEngine.removeEditLayer();
            $scope.editEngine.clear();

            $scope.updateThumbnail(layers.getCurrentIndex());

        }
    }, true);
}]);