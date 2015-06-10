app.controller('TransformationModalController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
        
        $scope.title = "Transformations";
        $scope.subtitle = "";
        
        $scope.transformations = [
            {name: "mirror horizontally", image: "/assets/img/arnold2.jpg",},
            {name: "mirror vertically", image: "/assets/img/arnold2.jpg",},
            {name: "rotate 90 degrees", image: "/assets/img/arnold2.jpg",},
            {name: "rotate 180 degrees", image: "/assets/img/arnold2.jpg",},
            {name: "rotate 270 degrees", image: "/assets/img/arnold2.jpg",},
        ];
        
        $scope.selectTransformation = function(name) {
            
            if (name == "rotate 90 degrees") {
                for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                    var rotation = $scope.renderEngine.layers[i].getRotation();
                    //$scope.renderEngine.layers[i].setRotation(rotation + 0.5 * Math.pi);
                }  
                $scope.renderEngine.render();
            }
            
            $scope.close();
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
        
        $scope.titlecase = function(string) {
            return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
    }
])
