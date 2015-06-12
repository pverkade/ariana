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
                name:  "sepia",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "gaussian blur",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "arnold",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "brightness",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "sepia",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "gaussian blur",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "arnold",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "brightness",
                image: "/assets/img/arnold2.jpg", 
            },
        ];
        
        $scope.selectFilter = function(name) {
            $scope.applyFilter(name, $scope.allLayers);
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
        }
    }
])
