/* 
 * Project Ariana
 * filters.logic.js
 * 
 * This file contains the FilterModalController, which controls the 
 * 'filters and effects' modal.
 *
 */
 
app.controller('FilterModalController', ['$scope', '$modalInstance', 
    function ($scope, $modalInstance) {
        
        $scope.filters = {
            
            "noise": {
                image: "/assets/img/arnold2.jpg", 
                constructor: NoiseFilter,
            },
            
            "contrast": {
                image: "/assets/img/arnold2.jpg",
                constructor: ContrastFilter,
            },
            
            "brightness": {
                image: "/assets/img/arnold2.jpg",
                constructor: BrightnessFilter,
            },
            
            "invert colors": {
                image: "/assets/img/arnold2.jpg",
                constructor: InvertColorsFilter,
            },
            
            "saturation": {
                image: "/assets/img/arnold2.jpg",
                constructor: SaturationFilter,
            },
            
            "sepia": {
                image: "/assets/img/arnold2.jpg",
                constructor: SepiaFilter,
            },
            
            "colorize": {
                image: "/assets/img/arnold2.jpg",
                constructor: ColorizeFilter,
            },
        };
        
        $scope.selectFilter = function(name) {
            var constructor = $scope.filters[name].constructor
            
            if (constructor) {
                var filterObject = new constructor();
                $scope.filter.filterName = name;
                $scope.filter.filterObject = filterObject;
                $scope.filter.filterParameters = filterObject.getAttributesObject();
            }
            $scope.close();
        };

        $scope.close = function() {
            $modalInstance.dismiss();
        };
        
        $scope.titlecase = function(string) {
            return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
    }
])
