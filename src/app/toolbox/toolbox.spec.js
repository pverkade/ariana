describe("The toolbox controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();

            _$controller_("AppCtrl", {$scope: $scope});
            $controller = _$controller_("ToolboxCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        });
    });

    describe("checkVisible", function() {
        it("should be true default", function() {
            expect($scope.checkVisible()).toBe(true);

            it("should be false for mocked active", function() {
                $scope.config.mouse.button[1] = true;
                expect($scope.checkVisible()).toBe('false');
            });
        });
    });

    describe("getCursor", function() {
        it("should return the cursor", function() {
            expect($scope.getCursor()).toEqual('default');
        });
    });

    describe("setCursor", function() {
        it("should change the cursor", function() {
            $scope.setCursor('test');
            expect($scope.getCursor()).toEqual('test');
        });
    });

    describe("getActiveToolFunctions", function() {
        it("should not be undefined", function() {
            expect($scope.getActiveToolFunctions()).not.toBeUndefined();
        });
    });

});