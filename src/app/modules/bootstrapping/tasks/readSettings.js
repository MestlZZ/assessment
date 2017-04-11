(function () {
    'use strict';

    angular.module('bootstrapping').factory('readSettingsTask', readSettingsTask);

    readSettingsTask.$inject = ['$q', 'preloadImagesService'];

    function readSettingsTask($q, preloadImagesService) {
        return ConfigurationReader.read().then(function(settings) {
            var mergedSettings = ConfigurationReader.init(settings);

            for(var prop in mergedSettings) {
                settings[prop] = mergedSettings[prop];
            }

            var imagesToPreload = [];

            if(settings.templateSettings.background.body.texture) {
                imagesToPreload.push({ 
                    src: settings.templateSettings.background.body.texture, 
                    attributes: [
                        {
                            key: 'crossOrigin',
                            value: 'Anonymous'
                        }
                    ] 
                });
            }

            if(settings.templateSettings.background.header.image.url) {
                imagesToPreload.push({
                    src: settings.templateSettings.background.header.image.url
                });
            }

            if(settings.templateSettings.logoUrl) {
                imagesToPreload.push({
                    src: settings.templateSettings.logoUrl
                });
            }

            return preloadImagesService.preloadImages(imagesToPreload).then(function(images) {
                var colors = settings.templateSettings.colors,
                    brightness = settings.templateSettings.background.body.brightness,
                    colorObj = {
                        r: 0,
                        g: 0,
                        b: 0
                    };
                
                if(settings.templateSettings.background.body.texture) {
                    colorObj = getAverageRGB(images[0]);
                } else if(settings.templateSettings.background.body.color) {
                    colorObj = hexToRgb(one.color(settings.templateSettings.background.body.color).hex());
                }

                if(brightness) {
                    setBrightnessToRgb(colorObj, brightness);
                }

                var color = {
                    key: "@content-body-color",
                    value: "rgb("+ colorObj.r +","+ colorObj.g +","+ colorObj.b +")"
                };

                colors.push(color);

                return settings;
            });
        });            
    }

    function getAverageRGB(imgEl) {    
        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;
            
        if (!context) {
            return defaultRGB;
        }
        
        height = canvas.height = (imgEl.naturalHeight > 100 ? 100 : imgEl.naturalHeight);
        width = canvas.width = (imgEl.naturalWidth > 100 ? 100 : imgEl.naturalWidth);
                
        context.drawImage(imgEl, 0, 0);
        
        try {
            data = context.getImageData(0, 0, width, height);
        } catch(e) {
            console.error('Image on a different domain');
            return defaultRGB;
        }
        
        length = data.data.length;
        
        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }
        
        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);
        
        return rgb;        
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function setBrightnessToRgb(rgb, brightness) {
        rgb.r += brightness > 0 ? (255 - rgb.r) * brightness : rgb.r * brightness;
        rgb.g += brightness > 0 ? (255 - rgb.g) * brightness : rgb.g * brightness;
        rgb.b += brightness > 0 ? (255 - rgb.b) * brightness : rgb.b * brightness;
    }
}());
