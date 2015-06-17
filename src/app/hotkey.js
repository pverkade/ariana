app.controller('HotkeyCtrl', function($scope, hotkeys) {
    hotkeys.add({
        combo: 'c',
        description: 'Select the crop tool',
        callback: function() {
            $scope.config.tools.activeTool = 'crop';
            $scope.config.tools.activeToolset = 'basic';
        }
    });

    hotkeys.add({
        combo: 'p',
        description: 'Select the pan tool',
        callback: function() {
            $scope.config.tools.activeTool = 'pan';
            $scope.config.tools.activeToolset = 'basic';
        }
    });

    hotkeys.add({
        combo: 'r',
        description: 'Select the rotate tool',
        callback: function() {
            $scope.config.tools.activeTool = 'rotate';
            $scope.config.tools.activeToolset = 'basic';
        }
    });

    hotkeys.add({
        combo: 's',
        description: 'Select the scale tool',
        callback: function() {
            $scope.config.tools.activeTool = 'scale';
            $scope.config.tools.activeToolset = 'basic';
        }
    });

    hotkeys.add({
        combo: 't',
        description: 'Select the translate tool',
        callback: function() {
            $scope.config.tools.activeTool = 'translate';
            $scope.config.tools.activeToolset = 'basic';
        }
    });

    hotkeys.add({
        combo: 'b',
        description: 'Select the brush tool',
        callback: function() {
            $scope.config.tools.activeTool = 'brush';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'e',
        description: 'Select the eraser tool',
        callback: function() {
            $scope.config.tools.activeTool = 'eraser';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'f',
        description: 'Select the fill tool',
        callback: function() {
            $scope.config.tools.activeTool = 'fill';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'ctrl+p',
        description: 'Select the palette tool',
        callback: function() {
            $scope.config.tools.activeTool = 'palette';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'd',
        description: 'Select the pencil tool',
        callback: function() {
            $scope.config.tools.activeTool = 'pencil';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'q',
        description: 'Select the colorpicker tool',
        callback: function() {
            $scope.config.tools.activeTool = 'picker';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'ctrl+c',
        description: 'Select the curve select tool',
        callback: function() {
            $scope.config.tools.activeTool = 'curve';
            $scope.config.tools.activeToolset = 'select';
        }
    });

    hotkeys.add({
        combo: 'ctrl+e',
        description: 'Select the elipse select tool',
        callback: function() {
            $scope.config.tools.activeTool = 'elipse';
            $scope.config.tools.activeToolset = 'select';
        }
    });

    hotkeys.add({
        combo: 'ctrl+m',
        description: 'Select the magic select tool',
        callback: function() {
            $scope.config.tools.activeTool = 'magic';
            $scope.config.tools.activeToolset = 'select';
        }
    });

    hotkeys.add({
        combo: 'ctrl+r',
        description: 'Select the rectangle select tool',
        callback: function() {
            $scope.config.tools.activeTool = 'rectangle';
            $scope.config.tools.activeToolset = 'select';
        }
    });
});
