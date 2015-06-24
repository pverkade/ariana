function createRenderEngine($scope) {
    var dummyDiv1 = document.createElement('div');
    var dummyDiv2 = document.createElement('div');
    var dummyDiv3 = document.createElement('div');
    dummyDiv1.innerHTML = '<canvas rendertarget="rendertarget" id="main-canvas"></canvas>';
    dummyDiv2.innerHTML = '<canvas id="editing-canvas"></canvas>';
    dummyDiv3.innerHTML = '<canvas id="top-canvas"></canvas>';

    $scope.startEngines(dummyDiv1.firstChild, dummyDiv2.firstChild, dummyDiv3.firstChild);
}