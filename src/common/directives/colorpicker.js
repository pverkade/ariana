angular.module('ariana').directive('colorpicker', function() {

    return {
        // only instantate as attribute colorpicker
        restrict: 'EA',
        
        // HTML template
        template: '<canvas class="palette" width="256px" height="256px"></canvas><canvas class="hue" width="32px" height="256px"></canvas><div class="preview"></div><div class="textinput">R: <input type="number" class="rgbhsv" name="R" onchange="update_val(event)" min="0" max="255"></div><div class="textinput">G: <input type="number" class="rgbhsv" name="G" onchange="update_val(event)" min="0" max="255"></div><div class="textinput">B: <input type="number" class="rgbhsv" name="B" onchange="update_val(event)" min="0" max="255"></div><div class="textinput">H: <input type="number" class="rgbhsv" name="H" onchange="update_val(event)" min="0" max="360"></div><div class="textinput">S: <input type="number" class="rgbhsv" name="S" onchange="update_val(event)" min="0" max="100"></div><div class="textinput">V: <input type="number" class="rgbhsv" name="V" onchange="update_val(event)" min="0" max="100"></div><div class="textinput">Hex: <input type="text" class="hex" onchange="update_hex(event)"></div>',

        })
    };
});
