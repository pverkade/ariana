/* 
 * Project Ariana
 * hotkey.js
 * 
 * This file descibes the hotkeys for the tools. 
 *
 */
 
app.controller('HotkeyCtrl', function($scope, hotkeys) {

    hotkeys.add({
        combo: 'p',
        description: 'Select the pan tool',
        callback: function() {
            $scope.config.tools.activeTool = 'pan';
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
        combo: 's',
        description: 'Select the scale tool',
        callback: function() {
            $scope.config.tools.activeTool = 'scale';
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
        combo: 'c',
        description: 'Select the color-palette tool',
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
        combo: 'b',
        description: 'Select the brush tool',
        callback: function() {
            $scope.config.tools.activeTool = 'brush';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'e',
        description: 'Select the eyedrop tool',
        callback: function() {
            $scope.config.tools.activeTool = 'picker';
            $scope.config.tools.activeToolset = 'painting';
        }
    });

    hotkeys.add({
        combo: 'q',
        description: 'Select the rectangle selection tool',
        callback: function() {
            $scope.config.tools.activeTool = 'rectangle';
            $scope.config.tools.activeToolset = 'select';
        }
    });
    
    hotkeys.add({
        combo: 'm',
        description: 'Select the magic selection tool',
        callback: function() {
            $scope.config.tools.activeTool = 'magic';
            $scope.config.tools.activeToolset = 'select';
        }
    });
    
    hotkeys.add({
        combo: 'l',
        description: 'Select the loose selection tool',
        callback: function() {
            $scope.config.tools.activeTool = 'loose';
            $scope.config.tools.activeToolset = 'select';
        }
    });
});
