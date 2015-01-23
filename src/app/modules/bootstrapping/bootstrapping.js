(function () {
    'use strict';

    angular.module('bootstrapping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'loadFontsTask', 'readSettingsTask', 'readPublishSettingsTask', 'preloadImages', 'preloadHtmlTask'];

    function runBlock($q, detectDeviceTask, loadFontsTask, readSettingsTask, readPublishSettingsTask, preloadImages, preloadHtmlTask) {
        var tasks = {
            'detectDeviceTask': detectDeviceTask,
            'loadFontsTask': loadFontsTask,
            'readSettings': readSettingsTask,
            'readPublishSettings': readPublishSettingsTask,
            'preloadHtmlTask': preloadHtmlTask,
            'preloadImages': preloadImages
        };

        $q.all(tasks).then(function (data) {
            var bootstrapModules = ['quiz'],
                settings = data.readSettings,
                publishSettings = data.readPublishSettings,
                preloadHtmls = data.preloadHtmlTask;

            angular.module('quiz').config(['$routeProvider', 'settingsProvider', 'htmlTemplatesCacheProvider', function ($routeProvider, settingsProvider, htmlTemplatesCacheProvider) {
                settingsProvider.setSettings(settings);
                htmlTemplatesCacheProvider.set(preloadHtmls);
            }]);

            if (!settings || settings.xApi.enabled) {
                bootstrapModules.push('quiz.xApi');
            }

            if (publishSettings) {
                angular.module('quiz.publishSettings').config(['publishSettingsProvider', function (publishSettingsProvider) {
                    publishSettingsProvider.setSettings(publishSettings);
                }]);

                bootstrapModules.push('quiz.publishSettings');
            }

            angular.bootstrap(document, bootstrapModules);
        });

    }
}());
