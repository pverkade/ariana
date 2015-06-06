app.controller('TransformationModalController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
        
        $scope.title = "Transformations";
        $scope.subtitle = "";
        
        $scope.transformations = [
            {"name": "Mirror horizontally", "image": "/assets/img/arnold2.jpg"},
            {"name": "Mirror vertically", "image": "/assets/img/arnold2.jpg"},
            {"name": "Rotate 90 degrees", "image": "/assets/img/arnold2.jpg"},
            {"name": "Rotate 180 degrees", "image": "/assets/img/arnold2.jpg"},
            {"name": "Rotate 270 degrees", "image": "/assets/img/arnold2.jpg"}
        ];
        
        $scope.selectTransformation = function(index){
            $modalInstance.dismiss();
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
])
