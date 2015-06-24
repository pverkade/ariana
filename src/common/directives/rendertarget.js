/*
 * Project Ariana
 * rendertarget.js
 *
 * This file contains an Angular directive for ...
 *
 */
 
app.directive('rendertarget', function() {
    return function($scope, $element) {
        $scope.rendertarget = $element;
    }
});