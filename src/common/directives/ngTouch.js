"use strict";

angular.module("ngTouch", [])
    .directive("ngTouchmove", function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchstart', onTouchStart);

                function onTouchStart($event) {
                    $event.preventDefault();
                    $element.bind('touchmove', onTouchMove);
                    $element.bind('touchend', onTouchEnd);
                }

                function onTouchMove($event) {
                    if ($event.targetTouches.length == 1 && $event.changedTouches.length == 1) {
                        console.log("MOVE");
                        console.log($event);
                        var method = '$scope.' + $element.attr('ng-touchmove');
                        $scope.$apply(function () {
                            eval(method);
                        });
                    }
                }

                function onTouchEnd($event) {
                    $event.preventDefault();
                    $element.unbind('touchmove', onTouchMove);
                    $element.unbind('touchend', onTouchEnd);
                }
            }
        };
    })
    .directive("ngTouchstart", function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchstart', onTouchStart);

                function onTouchStart($event) {
                    if ($event.targetTouches.length == 1) {
                        var method = '$scope.' + $element.attr('ng-touchstart');
                        console.log("TOUCH START");
                        $scope.$apply(function () {
                            eval(method);
                        });
                    }
                }
            }
        };
    })
    .directive("ngTouchend", function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchend', onTouchEnd);

                function onTouchEnd($event) {
                    if ($event.targetTouches.length == 1) {
                        var method = '$scope.' + $element.attr('ng-touchend');
                        console.log("TOUCH END");
                        $scope.$apply(function () {
                            eval(method);
                        });
                    }
                }
            }
        };
    })
    .directive("ngPinchzoom", function() {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchstart', onPinchZoomStart);

                function onPinchZoomStart($event) {
                    if ($event.targetTouches.length == 2) {
                        var point1 = $event.targetTouches[0];
                        var point2 = $event.targetTouches[1];
                        $scope.pinchZoomStartDist = Math.sqrt(
                            Math.pow(point2.pageX - point1.pageX, 2) +
                            Math.pow(point2.pageY - point1.pageY, 2)
                        );

                        $scope.pinchZoomIgnore = true;
                        $element.bind('touchmove', onPinchZoom);
                        $element.bind('touchend', onPinchZoomEnd);
                    }
                }

                function onPinchZoom($event) {
                    if ($event.targetTouches.length == 2) {
                        var point1 = $event.targetTouches[0];
                        var point2 = $event.targetTouches[1];
                        var dist = Math.sqrt(
                            Math.pow(point2.pageX - point1.pageX, 2) +
                            Math.pow(point2.pageY - point1.pageY, 2)
                        );
                        var scale = dist / $scope.pinchZoomStartDist;
                        var prevScale = $scope.pinchZoomPrevScale;
                        $scope.pinchZoomPrevScale = scale;
                        scale -= prevScale;

                        if (!$scope.pinchZoomIgnore) {
                            var method = '$scope.' + $element.attr('ng-pinchzoom');
                            $scope.$apply(function () {
                                eval(method);
                            });
                        } else {
                            $scope.pinchZoomIgnore = false;
                        }
                    }
                }

                function onPinchZoomEnd($event) {
                    $event.preventDefault();
                    $element.unbind('touchmove', onPinchZoom);
                    $element.unbind('touchend', onPinchZoomEnd);
                }
            }
        }
    });