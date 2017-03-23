(function () {
    'use strict';
    angular.module('bootstrapping')
           .service('webFontLoaderService', WebFontLoaderService);

    WebFontLoaderService.$inject = ['$q'];

    function WebFontLoaderService($q) {
        var that = this;
        that.load = load;

        function load() {
            var deferred = $q.defer();
            WebFont.load({
                custom: {
                    families: ['Robotoslab', 'Rabiohead', 'TwCenMTCondensed', 'OpenSans:n3,i4,n4,i6,n6,n7', 'OCRAExtended', 'BadScriptRegular', 'Custom Icons'],// jshint ignore:line
                    urls: ['css/fonts.css']
                },
                active: function () {
                    deferred.resolve();

                },
                inactive: function () {
                    deferred.reject('Browser does not support linked fonts or none of the fonts could be loaded!');
                }
            });
            return deferred.promise;
        }
    }

}());