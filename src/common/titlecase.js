angular.module('ariana').filter('titlecase', function () {
    return function (text) {
        return text.replace(/\w\S*/g, function(text) {
            return text.charAt(0).toUpperCase() + text.substr(1);
        });
    };
});

angular.module('ariana').filter('float', function () {
    return function (text) {
        return parseFloat(text);
    };
});