app.controller('FilterModalController', ['$scope', '$modalInstance', 
    function ($scope, $modalInstance) {
        
        $scope.filters = [
            
            {
                name:  "Sepia",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "Gaussian Blur",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "Brightness",
                image: "/assets/img/arnold2.jpg", 
            },
            
            {
                name:  "Arnold",
                image: "/assets/img/arnold2.jpg", 
            },
        ];
        
        $scope.selectFilter = function(name) {
            $scope.applyFilter($scope.selectedFilter, name);
            $scope.close();
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
])
