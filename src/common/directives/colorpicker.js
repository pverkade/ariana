angular.module('ariana').directive('colorpicker', function($window) {

    return {
        // only instantate as element
        restrict: "E",
        // HTML template, TODO templateURL
        template: "<h2> Hello </h2>",
        
        replace: true,
    
        controller: ["$scope", function($scope) {
            console.log("contoller");
        }],
    
        link: function($scope, $element, $attibutes) {
            // WHY
        },
        
    };
});
