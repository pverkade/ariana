describe("The toolbox accordion controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();

            $controller = _$controller_("ToolboxAccordionCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        })
    });

    describe("open state", function() {
        it("should be false default", function() {
            expect($scope.open).toBe(false);
        })
    });

});