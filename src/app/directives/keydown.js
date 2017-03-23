(function () {

    angular.module('assessment')
        .directive('keydown', keydown);

    function keydown() {
        return {
            restrict: 'A',
            multiElement: true,
            link: function ($scope, element, attr) {
                var codes = $scope.$eval(attr.keydown);

                element.bind('keydown', function (event) {
                    if(codes.hasOwnProperty(event.keyCode)){
                        if (_.isFunction(codes[event.keyCode].handler)) {    
                            codes[event.keyCode].handler();
                        }

                        if(!codes[event.keyCode].hasOwnProperty('preventDefault') || codes[event.keyCode].preventDefault) {
                            event.preventDefault();              
                        }

                        if(!codes[event.keyCode].hasOwnProperty('stopPropagation') || codes[event.keyCode].stopPropagation) {                        
                            event.stopPropagation();          
                        }                    
                    }
                });
            }
        };
    }
}());