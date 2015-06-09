app.controller('FilterModalController', ['$scope', '$modalInstance', 
    function ($scope, $modalInstance) {
        
        $scope.title = "Filters and Effects";
        $scope.subtitle = "";
        
        $scope.filters = [
            {name: "Blur",          image: "/assets/img/arnold2.jpg",},
            {name: "Gauss",         image: "/assets/img/arnold2.jpg",},
            {name: "Sepia",         image: "/assets/img/arnold2.jpg",},
            {name: "Noise",         image: "/assets/img/arnold2.jpg",},
            {name: "Yolo",          image: "/assets/img/arnold2.jpg",},
            {name: "Swag",          image: "/assets/img/arnold2.jpg",},
            {name: "Saturation",    image: "/assets/img/arnold2.jpg",},
            {name: "Colorize",      image: "/assets/img/arnold2.jpg",},
            {name: "Arnold",        image: "/assets/img/arnold2.jpg",},
            {name: "Arnold",        image: "/assets/img/arnold2.jpg",},
            {name: "Arnold",        image: "/assets/img/arnold2.jpg",},
            {name: "Arnold",        image: "/assets/img/arnold2.jpg",},
        ];
        
        $scope.selectFilter = function(name) {
            // TODO go into preview mode, set parameters
            // FIXME cannot access $scope of AppController
            //console.log($scope.renderEngine);
            //$scope.applyFilter(name);
            $modalInstance.dismiss();
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
])
