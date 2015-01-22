﻿(function () {

    angular.module('quiz')
        .directive('showToggle', showToggle);

    function showToggle() {
        return {
            restrict: 'A',
            multiElement: true,
            link: function ($scope, $element, attr) {
                $element.hide();
                $scope.$watch(attr.showToggle, function (value) {
                    $element.animate({
                        height: 'show',
                        opacity: value ? 1 : 0
                    });
                });
            }
        };
    }
}());