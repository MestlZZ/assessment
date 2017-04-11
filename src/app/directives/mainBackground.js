(function () {

    angular.module('assessment')
        .directive('mainBackground', directive);

    directive.$inject = ['settings'];


    function directive(settings) {
        return {
            restrict: 'E',
            link: function ($scope, $element) {
                var background = settings.background;

                if (!_.isObject(background) || !_.isObject(background.header) || !_.isObject(background.header.image) || !_.isString(background.header.image.url)) {
                    return;
                }

                var src = background.header.image.url,
                    position = '0 0',
                    repeat = 'no-repeat',
                    size = 'auto',
                    height = '100%',
                    $image = $('.main-background-image', $element),
                    $overlay = $('.main-background-overlay', $element);


                if (background.header.image.option === 'repeat') {
                    repeat = 'repeat';
                }

                if (background.header.image.option === 'fullscreen') {
                    size = 'cover';
                    position = 'center';
                }

                $image.css({
                    'background-image': 'url(' + src + ')',
                    'background-position': position,
                    '-webkit-background-size': size,
                    'background-size': size,
                    'background-repeat': repeat,
                    'height': height
                });

                if (background.header.brightness) {
                    $overlay.css({
                        "background-color": background.header.brightness > 0 ? 'white' : 'black',
                        "opacity": background.header.brightness > 0 ? background.header.brightness : -background.header.brightness
                    });
                }

                if (background.header.color) {
                    $image.css({
                        'background-color': background.header.color
                    });
                }
            }
        };
    }
}());