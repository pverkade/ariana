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
            tools.setTool('pan');
            tools.setToolset('basic');
        }
    });
    
    hotkeys.add({
        combo: 't',
        description: 'Select the translate tool',
        callback: function() {
            tools.setTool('translate');
            tools.setToolset('basic');
        }
    });

    hotkeys.add({
        combo: 's',
        description: 'Select the scale tool',
        callback: function() {
            tools.setTool('scale');
            tools.setToolset('basic');
        }
    });

    hotkeys.add({
        combo: 'r',
        description: 'Select the rotate tool',
        callback: function() {
            tools.setTool('rotate');
            tools.setToolset('basic');
        }
    });    
    
    hotkeys.add({
        combo: 'c',
        description: 'Select the color-palette tool',
        callback: function() {
            tools.setTool('palette');
            tools.setToolset('painting');
        }
    });
    
    hotkeys.add({
        combo: 'd',
        description: 'Select the pencil tool',
        callback: function() {
            tools.setTool('pencil');
            tools.setToolset('painting');
        }
    });
    
    hotkeys.add({
        combo: 'b',
        description: 'Select the brush tool',
        callback: function() {
            tools.setTool('brush');
            tools.setToolset('painting');
        }
    });

    hotkeys.add({
        combo: 'e',
        description: 'Select the eyedrop tool',
        callback: function() {
            tools.setTool('picker');
            tools.setToolset('painting');
        }
    });

    hotkeys.add({
        combo: 'q',
        description: 'Select the rectangle selection tool',
        callback: function() {
            tools.setTool('rectangle');
            tools.setToolset('select');
        }
    });
    
    hotkeys.add({
        combo: 'm',
        description: 'Select the magic selection tool',
        callback: function() {
            tools.setTool('magic');
            tools.setToolset('select');
        }
    });
    
    hotkeys.add({
        combo: 'l',
        description: 'Select the loose selection tool',
        callback: function() {
            tools.setTool('loose');
            tools.setToolset('select');
        }
    });
});
