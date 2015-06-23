app.filter('titlecase', function () {
    return function (text) {
        return text.replace(/\w\S*/g, function(text) {
            return text.charAt(0).toUpperCase() + text.substr(1);
        });
    };
});

app.filter('float', function () {
    return function (text) {
        return parseFloat(text);
    };
});

app.filter('int', function () {
    return function (text) {
        return parseInt(text);
    };
});