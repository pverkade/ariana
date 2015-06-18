app.directive('colorselector', function() {

    return {
        // only instantate as attribute colorpicker
        restrict: 'EA',        
        // HTML template
        templateUrl: 'app/toolbox/colorselector/colorselector.tpl.html',
        controller: 'ColorselectorCtrl'
    };
});
