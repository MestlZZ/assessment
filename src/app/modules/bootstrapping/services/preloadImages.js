(function () {
    'use strict';

    angular.module('bootstrapping')
        .service('preloadImagesService', preloadImagesService);

    preloadImagesService.$inject = ['$q'];

    function preloadImagesService($q) {
        var that = this;

        that.preloadImage = function(img) {
            var defer = $q.defer(),
                image = new Image();

            img.hasOwnProperty('attributes') && img.attributes.forEach(function (attr) {
                image.setAttribute(attr.key, attr.value);
            });

            image.onload = function() {
                defer.resolve(image);
            }

            image.onerror = function() {
                defer.resolve(image);
            }

            image.src = img.src;

            return defer.promise;
        }

        that.preloadImages = function(images) {
            var promises = [];

            images.forEach(function (img) {
                promises.push(that.preloadImage(img));
            });

            return $q.all(promises);
        }
    }
})();