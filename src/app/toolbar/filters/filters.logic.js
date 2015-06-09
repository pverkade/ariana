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
        ];
        
        $scope.selectFilter = function(name) {
            $scope.applyFilter(name);
            $scope.close();
        };

        $scope.close = function() {
            $modalInstance.dismiss();
        };
        
        $scope.titlecase = function(string) {
            return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
    }
])
