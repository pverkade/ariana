app.controller('toolbarCtrl', ['$scope', '$modal',
    function ($scope, $modal) {

        // SVG FIX FOT STACK OVEFLOW
        $('img.svg').each(function(){
            var $img    = $(this);
            var id      = $img.attr('id');
            var src     = $img.attr('src');

            /* Load image src. */
            $.get(src, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof id !== 'undefined') {
                    $svg = $svg.attr('id', id);
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns');
                $svg = $svg.removeAttr('xmlns:xlink');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');
        });
        
        $scope.openUploadModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalCtrl',
                size: 'lg'
            });
        };
        
        $scope.saveImage = function() {
            // TODO I have no idea if this works :^)
            var image = $scope.renderEngine.renderToImg();
            // retrieves the base64 data
            var data = image.substr(image.indexOf(',') + 1).toString();
            var url = "/save-image";

            var dataInput = document.createElement("input") ;
            dataInput.setAttribute("name", 'image-data') ;
            dataInput.setAttribute("value", data);
            dataInput.setAttribute("type", "hidden");

            var nameInput = document.createElement("input") ;
            nameInput.setAttribute("name", 'image-name') ;
            nameInput.setAttribute("value", "hello_world" + '.png');

            var myForm = document.createElement("form");
            myForm.method = 'post';
            myForm.action = url;
            myForm.appendChild(dataInput);
            myForm.appendChild(nameInput);

            document.body.appendChild(myForm) ;
            myForm.submit() ;
            document.body.removeChild(myForm) ;
        };
        
        $scope.openTransformationModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/transformations/transformations.tpl.html',
                controller:  'TransformationModalController',
                size: 'lg'
            });
        };
    
        $scope.openFilterModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/filters/filters.tpl.html',
                controller:  'FilterModalController',
                size: 'lg'
            });
        };    

        
    }
]);
