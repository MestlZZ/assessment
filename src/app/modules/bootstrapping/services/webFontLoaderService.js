(function () {
    'use strict';
    angular.module('bootstrapping')
           .service('webFontLoaderService', WebFontLoaderService);

    WebFontLoaderService.$inject = ['$q'];

    function WebFontLoaderService($q) {
        var that = this;
        that.load = load;

        function load(fonts, manifest, publishSettings) {
            var def = $q.defer();
            var fontFamilies = fonts;

            var customFonts = manifest.fonts.map(function(font){
                return font.fontFamily;
            });

            var familiesToLoad = _.chain(fontFamilies)
                .map(function(font) {
                    return { "fontFamily": font.fontFamily, "variants": ["300","400", "600"], "place": font.place };
                })
                .uniq(function(font){
                    return font.fontFamily;
                })
                .filter(function(font){
                    return font.place !== 'none' && !_.contains(customFonts, font.fontFamily);
                })
                .value();

            if (!familiesToLoad && !familiesToLoad.length) {
                familiesToLoad = [{ "fontFamily": 'Open Sans', "variants": ["300","400", "600"], "place": 'google' }];
            }
            
            var defer = $q.defer();

            var defers = [defer];

            var fontLoaderConfig = {
                active: function() {
                    defer.resolve();
                },
                inactive: function() {
                    //added to make possible ofline template loading
                    defer.resolve();
                }
            };

            if (familiesToLoad.length) {
                _.each(familiesToLoad, function(font){
                    if(fontLoaderConfig.hasOwnProperty(font.place)) {
                        fontLoaderConfig[font.place].families.push(mapFontName(font));
                    } else if(font.place === 'custom') {
                        fontLoaderConfig.custom = {
                            families: [mapFontName(font)],
                            urls: [publishSettings.customFontPlace]
                        };
                    } else {
                        fontLoaderConfig[font.place] = {
                            families: [mapFontName(font)]
                        };
                    }
                });
            }

            window.WebFont && WebFont.load(fontLoaderConfig);

            if (manifest.fonts && manifest.fonts.length) {
                var fonts = _.groupBy(manifest.fonts, function(f){
                    return f.url;
                });

                var defer = $q.defer();
                defers.push(defer);

                var fontLoaderConfig = {
                        active: function() {
                            defer.resolve();
                        },
                        custom: {
                            families: [],
                            urls: []
                        },
                        inactive: function() {
                            //added to make possible ofline template loading
                            defer.resolve();
                        }
                    };

                _.each(_.keys(fonts), function(url){
                    fontLoaderConfig.custom.families = fontLoaderConfig.custom.families.concat(fonts[url].map(mapFontName)); 
                    fontLoaderConfig.custom.urls.push(url);                  
                });
                
                window.WebFont && WebFont.load(fontLoaderConfig);
            }

            $q.all(defers).then(function(){
                def.resolve();
            });

            return def.promise;
        }

        function mapFontName(fontToLoad) {
            return fontToLoad.fontFamily + (fontToLoad.variants && fontToLoad.variants.length ? ':' + fontToLoad.variants.join(',') : '');
        }
    }
}());