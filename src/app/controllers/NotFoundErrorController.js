(function() {
    'use strict';

    angular
        .module('assessment')
        .controller('NotFoundErrorController', ErrorController);

    ErrorController.$inject = ['$rootScope', '$location', 'settings', 'assessment'];

    function ErrorController($rootScope, $location, settings, assessment) {
        var that = this;

        $rootScope.title = '404 |' + assessment.title;
        
        that.logoUrl = settings.logoUrl;
        
        that.goHome = function() {
            $location.path('/');
        };
    }

}());