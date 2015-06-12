angular.module('ariana').directive('colorpicker', function() {

    console.log("YOLO DIRECTIVE");

    return {
        // only instantate as element <colorpicker> or attribute colorpicker
        restrict: "EA",
        
        // HTML template, TODO use templateURL
        template: "<h2> Hello kaas </h2>",
        
        // dont overwrite <colorpicker> element with HTML
        replace: false,
    
        /*
        controller: ["$scope", function($scope) {
            console.log("contoller");
        }],
        */
    
        /*
        link: function($scope, $element, $attibutes) {
        }, 
        */
    };
});
