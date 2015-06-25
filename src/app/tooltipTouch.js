// configure the tooltipProvider
app.config(['$tooltipProvider', function ($tooltipProvider) {

    var parser = new UAParser();
    var result = parser.getResult();
    var touch = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');

    if (touch) {
        var options = {
            trigger: 'dontTrigger' // default dummy trigger event to show tooltips
        };

        $tooltipProvider.options(options);
    }

}]);