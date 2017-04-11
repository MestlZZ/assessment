(function () {
    'use strict';

    angular.module('assessment')
        .directive('progressControl', progressControl);

    progressControl.$inject = ['$translate', '$window'];

    var translate;
    function progressControl($translate, $window) {
        translate = $translate;
        return {
            restrict: 'E',
            template: '<div class="progress-control-wrapper">\
                <canvas class="progress-control-circle"></canvas>\
                <div class="progress-control-info">\
                    <span class="progress-control-info-score"></span>\
                    <span class="progress-control-info-text"></span>\
                </div>\
                <span class="progress-control-mastery-score"></span>\
                <div class="progress-control-hint">\
                    <i class="progress-control-hint-icon icon arrow-right"></i>\
                    <span class="progress-control-hint-text"></span>\
                </div>\
            </div>',
            scope: {
                progress: '=',
                masteryScore: '='
            },
            link: function ($scope, $element) {
                $scope.$watch(['progress', 'masteryScore'], onUpdate);                   

                angular.element( $window ).on( 'resize', onUpdate );
                
                $scope.$on('$destroy', function() {
                    angular.element( $window ).off( 'resize', onUpdate );
                });

                function onUpdate() {
                    createProgressControl( $scope, $element );
                }
            }
        };

        function createProgressControl(scope, $element) {
            removeFontPreloadElements();

            var 
                $wrapper = $element.children('.progress-control-wrapper'),
                $canvas = $wrapper.children('canvas');
                
            $wrapper.addClass( scope.progress >= scope.masteryScore ? 'success' : 'fail' );

            var 
                width = $canvas.width() || 162,
                height = $canvas.height() || 162;

            $canvas.attr('width', width);
            $canvas.attr('height', height);
            $canvas.attr('data-score', scope.progress);
            $canvas.attr('data-masteryScore', scope.masteryScore);

            var drawingSettings = {
                width: width,
                height: height,
                circle: {
                    position: {
                        X: width / 2,
                        Y: height / 2
                    },
                    width: parseInt($canvas.css('border-width')) || 3,
                    color: $canvas.css('border-color') || ( (scope.progress >= scope.masteryScore) ? '#4caf50' : '#f16162' ),
                    shadowColor: $canvas.css('color') || 'rgba(66,81,95,.7)',
                    radius: height / 2
                }
            };

            drawingSettings.circle.radius -= drawingSettings.circle.width;
                    
            var context = $canvas[0].getContext('2d');

            context.clearRect(0, 0, width, height);

            buildProgressControl(scope, context, drawingSettings, $element);
        }

        function removeFontPreloadElements() {
            $('.fontPreload').remove();
        }

        function buildProgressControl(scope, context, drawingSettings, $element) {
            var progressAngle = 2 * Math.PI * (scope.progress / 100) - 0.5 * Math.PI;

            //  drawing circle
            drawCircle(context, drawingSettings.circle.position.X, drawingSettings.circle.position.Y, drawingSettings.circle.radius, drawingSettings.circle.color, drawingSettings.circle.width, progressAngle, false);

            //  drawing circle background
            if(scope.progress) {
                if(scope.progress !== 100) {
                    drawCircle(context, drawingSettings.circle.position.X, drawingSettings.circle.position.Y, drawingSettings.circle.radius, drawingSettings.circle.shadowColor, drawingSettings.circle.width, progressAngle, true);
                }
            } else {
                drawCircle(context, drawingSettings.circle.position.X, drawingSettings.circle.position.Y, drawingSettings.circle.radius, drawingSettings.circle.shadowColor, drawingSettings.circle.width);
            }

            var 
                $wrapper = $element.children('.progress-control-wrapper'),
                $infoContainer = $wrapper.children('.progress-control-info'),
                $masteryScore = $wrapper.children('.progress-control-mastery-score'),
                $hint = $wrapper.children('.progress-control-hint'),
                $hintText = $hint.children('.progress-control-hint-text'),
                $infoScore = $infoContainer.children('.progress-control-info-score'),
                $infoText = $infoContainer.children('.progress-control-info-text');

            $infoScore.text(scope.progress + '%');

            var infoTextKey = scope.progress >= scope.masteryScore ? '[tracking and tracing result success]' : '[tracking and tracing result failed]';
            
            translate(infoTextKey).then(function (translation) {
                var statusText = translation;
                
                $infoText.text(statusText);

                if($infoText.width() > drawingSettings.width) {
                    $infoText.addClass('text-crop');

                    addTooltip($infoText, statusText, 'info');
                }

                $masteryScore.text(scope.masteryScore + '%');
                $infoScore.text(scope.progress + '%');

                var 
                    masteryScoreAngle = 2 * Math.PI * (scope.masteryScore / 100) - 0.5 * Math.PI,
                    masteryScoreX = drawingSettings.circle.position.X + (Math.cos(masteryScoreAngle) * (drawingSettings.circle.radius)),
                    masteryScoreY = drawingSettings.circle.position.Y + (Math.sin(masteryScoreAngle) * (drawingSettings.circle.radius));

                $masteryScore.css({ top: masteryScoreY - $masteryScore.height() / 2, left: masteryScoreX - $masteryScore.width() / 2 });
                
                var 
                    isSmallResolution = $(document).width() <= 320,
                    hintKey = isSmallResolution ? '[tracking and tracing mastery score small hint]' : '[tracking and tracing mastery score hint]';
                        
                translate(hintKey).then(function (translation) {
                    var isLeftSideText = scope.masteryScore >= 50;

                    $hintText.text(translation);

                    $hint.addClass(isLeftSideText ? 'left' : 'right');
                    $hint.css({ top: masteryScoreY, left: masteryScoreX });

                    if(isSmallResolution && isLeftSideText) {
                        var 
                            width = $masteryScore.offset().left >= 115 ? 100 : $masteryScore.offset().left - 15,
                            marginLeft = -($masteryScore.offset().left + 10) <= -125 ? -125 : -($masteryScore.offset().left + 10);

                        $hint.css({ width: width, marginLeft: marginLeft });
                    } else if (isSmallResolution && !isLeftSideText) {
                        $hint.css({ width: $window.outerWidth - $hint.offset().left - 7 });
                    } else {
                        $hint.css("width", "");
                        $hint.css("marginLeft", "");
                    }
                });
        });
        }

        function drawCircle(context, circleX, circleY, circleRadius, color, lineWidth, angle, isToRight) {
            if (angle === undefined) {
                angle = 1.5 * Math.PI;
            }

            context.beginPath();
            context.arc(circleX, circleY, circleRadius, -0.5 * Math.PI, angle, isToRight);
            context.lineWidth = lineWidth;
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

        function addTooltip($element, text, className, onCenter) {
            var 
                $tooltip = $('<span class="tooltip-container">'),
                $title = $('<span>'),
                elementCenterX = parseInt($element.offset().left - $element.parent().offset().left) + (onCenter ? $element.width() / 2 : 5),
                elementBottomY = parseInt($element.offset().top - $element.parent().offset().top) + $element.height();

            $title.addClass('title');
            $title.text(text || $element.text());

            $tooltip.html($title); 
            $tooltip.addClass(className);       
            $tooltip.css({top: elementBottomY, left: elementCenterX});
            
            $element.after(tooltip);

            return tooltip;
        }
    }
}());