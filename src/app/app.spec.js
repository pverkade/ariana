describe("The app controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_("AppCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        });

        it("should create empty engines", function() {
            expect($scope.renderEngine).not.toBeUndefined();
            expect($scope.drawEngine).not.toBeUndefined();
            expect($scope.editEngine).not.toBeUndefined();
        });
    });

    describe("scope function", function() {
        it("should start the engines", function() {
            var dummyDiv1 = document.createElement('div');
            var dummyDiv2 = document.createElement('div');
            var dummyDiv3 = document.createElement('div');
            dummyDiv1.innerHTML = '<canvas rendertarget="rendertarget" id="main-canvas"></canvas>';
            dummyDiv2.innerHTML = '<canvas id="editing-canvas"></canvas>';
            dummyDiv3.innerHTML = '<canvas id="top-canvas"></canvas>';

            $scope.startEngines(dummyDiv1.firstChild, dummyDiv2.firstChild, dummyDiv3.firstChild);

            expect($scope.renderEngine).not.toBeNull();
            expect($scope.drawEngine).not.toBeNull();
            expect($scope.editEngine).not.toBeNull();
        });
    });
});