(function () {
    'use strict';

    angular.module('assessment')
           .provider('settings', settingsProvider);

    function settingsProvider() {
        var cachedSettings = {};

        return {
            setSettings: function (settings) {
                if (!_.isObject(settings)) {
                    throw 'Settings is empty!';
                }

                cachedSettings = settings;
            },
            $get: function () {
                return cachedSettings;
            }
        };
    }
}());