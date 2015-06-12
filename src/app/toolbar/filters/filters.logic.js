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
        
        $scope.filters = [
            
            {
                name:  "noise",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "contrast",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "brightness",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name: "invert colors",
                image: "/assets/img/arnold2.jpg",
            },
            
            {
                name: "saturation",
                image: "/assets/img/arnold2.jpg",
            },
            
            {
                name: "colorize",
                image: "/assets/img/arnold2.jpg",
            },
        ];
        
        $scope.selectFilter = function(name) {
            $scope.applyFilter(name);
            $scope.close();
        };
        
        $scope.allLayers = true;

        $scope.toggleLayers = function() {
            if ($scope.allLayers) $scope.allLayers = false;
            else $scope.allLayers = true;
        };
        
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        
        $scope.titlecase = function(string) {
            return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
        
        $scope.applyFilter = function(name) {
            var filter = null;
            
            // TODO use dictionary
            
            if (name == "brightness") {
                filter = new BrightnessFilter();
                filter.setAttribute("brightness", 2);
            }
            
            if (name == "contrast") {
                filter = new ContrastFilter();
                filter.setAttribute("contrastValue", 2);
            }
            
            if (name == "noise") {
                filter = new NoiseFilter();
            }
            
            if (name == "sepia") {
                filter = new SepiaFilter();
            }
            
            if (name == "invert colors") {
                filter = new InvertColorsFilter();
            }
            
            if (name == "saturation") {
                filter = new SaturationFilter();
            }
            
            if (name == "colorize") {
                filter = new ColorizeFilter();
            }
            
            if (filter) {
                if ($scope.allLayers) {
                    var list = [];
                    for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) list.push(i);
                    $scope.renderEngine.filterLayers(list, filter);
                }
                    
                else $scope.renderEngine.filterLayers([$scope.config.layers.currentLayer], filter);
                
                /* Show the result. */
                $scope.renderEngine.render();
            }
            
        };
    }
])
