(function () {

    angular.module('assessment')
        .directive('focus', focus);

    focus.$inject = ['$timeout'];

    function focus($timeout) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function ($scope, element, attr) {
                $scope.$watch(attr.focus, function (value) {
                    if(value) {
                        $timeout(function() {
                            element[0].focus();
                        }, 0);
                    }
                });
            }
        };
    }
}());