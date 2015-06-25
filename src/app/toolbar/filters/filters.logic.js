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
                image: "/assets/img/noisesample.jpg", 
                constructor: NoiseFilter
            },
            
            "contrast": {
                image: "/assets/img/contrastsample.jpg",
                constructor: ContrastFilter
            },
            
            "brightness": {
                image: "/assets/img/brightnesssample.jpg",
                constructor: BrightnessFilter
            },
            
            "invert colors": {
                image: "/assets/img/invertsample.jpg",
                constructor: InvertColorsFilter
            },
            
            "saturation": {
                image: "/assets/img/saturationsample.jpg",
                constructor: SaturationFilter
            },
            
            "sepia": {
                image: "/assets/img/sepiasample.jpg",
                constructor: SepiaFilter
            },
            
            "colorize": {
                image: "/assets/img/colorizesample.jpg",
                constructor: ColorizeFilter
            },

            "threshold" : {
                image: "/assets/img/thresholdsample.jpg",
                constructor: ThresholdFilter
            }
        };
        
        $scope.selectFilter = function(name) {
            var constructor = $scope.filters[name].constructor;
            
            if (constructor) {
                var filterObject = new constructor();
                $scope.filter.filterName = name;
                $scope.filter.filterObject = filterObject;
                $scope.filter.filterParameters = filterObject.getAttributesObject();

                $scope.applyFilterOnLayers();
            }
            
            $scope.config.tools.activeTool = 'pan';
            $scope.close();
        };

        $scope.close = function() {
            $modalInstance.dismiss();
        };
    }
]);
