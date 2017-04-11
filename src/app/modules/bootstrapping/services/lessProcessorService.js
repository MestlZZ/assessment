(function () {
    'use strict';
    angular.module('bootstrapping')
           .service('lessProcessorService', LessProcessorService);

    function LessProcessorService() {
        var that = this;
        that.load = load;
        that.vars = {};

        function load(colors, fonts) {
            clearLocalStorage();

            _.each(colors, function(pair) {
                if (!pair || !pair.value) {
                    return;
                }

                that.vars[pair.key] = pair.value;
            });

            _.each(fonts, function (obj) {
                var props = _.keys(obj);
                _.each(props, function (prop) {
                    if (prop === 'key' || prop === 'isGeneralSelected' || prop === 'isGeneralColorSelected' 
                    || prop === 'place' || obj[prop] == null) {
                        return;
                    }

                    if (prop === 'size') {
                        that.vars['@' + obj.key + '-' + prop] = obj[prop] + 'px';
                    }else{
                        that.vars['@' + obj.key + '-' + prop] = obj[prop];
                    }
                });
            });
            
            return less.modifyVars(that.vars);
        };

        function clearLocalStorage() {
            if (!window.localStorage || !less) {
                return;
            }

            var host = window.location.host;
            var protocol = window.location.protocol;
            var keyPrefix = protocol + '//' + host + '/css/colors.less';

            for(var key in window.localStorage) {
                if (!window.localStorage.hasOwnProperty(key)) {
                    continue;
                }

                if (key.indexOf(keyPrefix) === 0) {
                    delete window.localStorage[key];
                }
            }
        }
    }

}());