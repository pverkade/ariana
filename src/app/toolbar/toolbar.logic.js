angular.module('ariana').controller('toolbarCtrl', function($scope) {

    // SVG FIX FOT STACK OVEFLOW
    /*
    $('.svg-img').each(function(){
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    }); */
    
    /*
    $scope.filterActive = false;
    $scope.toggleFilters = function() {
        if ($scope.filtersActive) $scope.filtersActive = false;
        else $scope.filtersActive = true;
    }*/
    
    $scope.transformations = [
        {name: "Rotate left 90", image: "/assets/img/arnold2.jpg"},
        {name: "Rotate right", image: "/assets/img/arnold2.jpg"},
    ];  
});

angular.module('ariana').controller('FilterController', function($scope) {
    
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
});
