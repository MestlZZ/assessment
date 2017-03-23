(function () {
    'use strict';

    angular.module('bootstrapping').factory('preloadImagesTask', preloadImagesTask);

    preloadImagesTask.$inject = ['$q'];
    
    var imagesStack = [
        'css/img/main-background.jpg'
    ];

    function preloadImagesTask($q) {
        var promises = [];

        imagesStack.forEach(function (url) {
            var defer = $q.defer();

            $('<img />').attr('src', url).load(function () {
                defer.resolve();
            });

            promises.push(defer.promise);
        });

        return $q.all(promises);
    }

})();