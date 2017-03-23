(function () {
    'use strict';

    angular.module('bootstrapping').service('fixIEScrollTask', fixIEScrollTask);

    fixIEScrollTask.$inject = ['$window'];

    function fixIEScrollTask($window) {
        if($window.navigator.userAgent.match(/Trident\/7\./) 
            || $window.navigator.userAgent.match(/Edge/i)) { // if IE or Edge
                $('body').on("mousewheel", function() {
                    // remove default behavior
                    event.preventDefault(); 

                    //scroll without smoothing
                    var wheelDelta = event.wheelDelta;
                    var currentScrollPosition = $window.pageYOffset;
                    $window.scrollTo(0, currentScrollPosition - wheelDelta);
                });

                $('body').on("keydown", function(event) {
                    var currentScrollPosition = $window.pageYOffset,
                        wheelDelta = 40;

                    if(event.keyCode == 38) {                        
                        $window.scrollTo(0, currentScrollPosition - wheelDelta);

                        event.preventDefault();
                    } else if(event.keyCode == 40) {
                        $window.scrollTo(0, currentScrollPosition + wheelDelta);
                        
                        event.preventDefault(); 
                    }
                });
        }
    }

}());