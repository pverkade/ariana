function createRenderEngine($scope) {
    var dummyDiv1 = document.createElement('div');
    var dummyDiv2 = document.createElement('div');
    dummyDiv1.innerHTML = '<canvas rendertarget="rendertarget" id="main-canvas">';
    dummyDiv2.innerHTML = '</canvas><canvas id="editing-canvas"></canvas>';

    $scope.startEngines(dummyDiv1.firstChild, dummyDiv2.firstChild);
}