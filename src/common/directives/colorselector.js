app.directive('colorpicker', function() {

    return {
        // only instantate as attribute colorpicker
        restrict: 'EA',        
        // HTML template
        templateUrl: 'app/toolbox/colorpicker/colorpicker.tpl.html',
        controller: 'ColorpickerCtrl'
    };
});
