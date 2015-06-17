describe("The app controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_("AppCtrl", {$scope: $scope});
        })
    )

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        })
    })

})