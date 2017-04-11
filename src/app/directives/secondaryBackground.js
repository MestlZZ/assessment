(function () {

    angular.module('assessment')
        .directive('secondaryBackground', directive);

    directive.$inject = ['settings'];


    function directive(settings) {
        return {
            restrict: 'E',
            link: function ($scope, $element) {
                var background = settings.background;

                if (!_.isObject(background) || !_.isObject(background.body) || !background.body.enabled) {
                    return;
                }

                var $image = $('.secondary-background-image', $element),
                    $overlay = $('.secondary-background-overlay', $element);

                if(background.body.texture) {
                    var src = background.body.texture,
                        position = '0 0',
                        repeat = 'repeat',
                        size = 'auto';
                        
                    $image.css({
                        'background-image': 'url(' + src + ')',
                        'background-position': position,
                        '-webkit-background-size': size,
                        'background-size': size,
                        'background-repeat': repeat
                    });
                } else if(background.body.color) {
                    $image.css({
                        'background-color': background.body.color
                    });
                }

                if (background.body.brightness) {
                    $overlay.css({
                        "background-color": background.body.brightness > 0 ? 'white' : 'black',
                        "opacity": background.body.brightness > 0 ? background.body.brightness : -background.body.brightness
                    });
                }

                if (background.body.color) {
                    $image.css({
                        'background-color': background.body.color
                    });
                }
            }
        };
    }
}());