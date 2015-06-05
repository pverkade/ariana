angular.module('ariana').controller('toolbarCtrl', function($scope) {

    // SVG FIX FOT STACK OVEFLOW
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
    });
    
    $scope.filterActive = false;
    $scope.toggleFilters = function() {
        if ($scope.filtersActive) $scope.filtersActive = false;
        else $scope.filtersActive = true
    }
    
    $scope.filters = [
        {name: "Gauss", image: "fuckyou.png",},
        {name: "Swag",  image: "fuckyou.png",},
        {name: "Yolo",  image: "fuckyou.png",},
        {name: "420",   image: "fuckyou.png",}
        {name: "P",     image: "fuckyou.png",},
        {name: "KKK",   image: "fuckyou.png",},
        {name: "1488",  image: "fuckyou.png",},
        {name: "A",     image: "fuckyou.png",}
        {name: "BN",    image: "fuckyou.png",},
        {name: "pPOO",  image: "fuckyou.png",},
        {name: "HAJA",  image: "fuckyou.png",},
        {name: "911",   image: "fuckyou.png",},
    ];

});
