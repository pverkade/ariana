/*
angular.module('ariana').controller('FilterModalController', function($scope) {
    
    $scope.title = "Filters and effects";
    $scope.subtitle = "";
    
    $scope.filters = [
        {name: "Blur", image: "/assets/img/arnold2.jpg"},
        {name: "Gauss", image: "/assets/img/arnold2.jpg"},
        {name: "Sepia", image: "/assets/img/arnold2.jpg"},
        {name: "Noise", image: "/assets/img/arnold2.jpg"},
        {name: "Yolo", image: "/assets/img/arnold2.jpg"},
        {name: "Swag", image: "/assets/img/arnold2.jpg"},
        {name: "Saturation", image: "/assets/img/arnold2.jpg"},
        {name: "Arnold", image: "/assets/img/arnold2.jpg"},
        {name: "Arnold", image: "/assets/img/arnold2.jpg"},
        {name: "Arnold", image: "/assets/img/arnold2.jpg"},
        {name: "Arnold", image: "/assets/img/arnold2.jpg"},
        {name: "Arnold", image: "/assets/img/arnold2.jpg"}
    ];
    
    $scope.selectFilter = function(index){
        console.log("Selected " + $scope.filters[index].name);
        //TODO her comes the call to use the filter
    };
}); */

app.controller('FilterModalController', ['$scope', '$modalInstance', 
    function ($scope, $modalInstance) {
        
        $scope.title = "Filters and effects";
        $scope.subtitle = "";
        
        $scope.filters = [
            {name: "Blur", image: "/assets/img/arnold2.jpg"},
            {name: "Gauss", image: "/assets/img/arnold2.jpg"},
            {name: "Sepia", image: "/assets/img/arnold2.jpg"},
            {name: "Noise", image: "/assets/img/arnold2.jpg"},
            {name: "Yolo", image: "/assets/img/arnold2.jpg"},
            {name: "Swag", image: "/assets/img/arnold2.jpg"},
            {name: "Saturation", image: "/assets/img/arnold2.jpg"},
            {name: "Arnold", image: "/assets/img/arnold2.jpg"},
            {name: "Arnold", image: "/assets/img/arnold2.jpg"},
            {name: "Arnold", image: "/assets/img/arnold2.jpg"},
            {name: "Arnold", image: "/assets/img/arnold2.jpg"},
            {name: "Arnold", image: "/assets/img/arnold2.jpg"}
        ];
        
        $scope.selectFilter = function(index){
            console.log("Selected " + $scope.filters[index].name);
            //TODO her comes the call to use the filter
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
])
