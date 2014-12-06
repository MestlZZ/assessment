﻿(function () {

    angular.module('quiz')
        .directive('blankSelect', blankSelect);

    function blankSelect() {
        return {
            restrict: 'C',
            transclude: 'element',
            replace: true,
            scope: true,
            controller: function ($scope, $element) {
                var
                    attr = $element.attr('data-group-id'),
                    question = $scope.question,
                    group = _.find(question.groups, function (g) {
                        return g.groupId === attr;
                    });

                if (!group) {
                    throw 'Can\'t find answer group with id' + attr;
                }

                $scope.group = group;
            },
            link: function ($scope, $element) {
                $element
                    .removeClass('blankSelect')
                    .on('click', function () {
                        show($element, $scope.group.answers, function (newValue) {
                            $scope.group.answer = newValue;
                            $scope.$apply();
                        });
                        //e.preventDefault();
                        //e.stopImmediatePropagation();
                    });
            },
            template: '<div class="select-wrapper">' +
                        '<div class="current default">Choose value</div>' +
                        '<div class="highlight">' +
                      '</div>'
        };
    }



    function show($element, options, callback) {

        $element.addClass('active');

        var
            container = $('<div />')
                .addClass('select-container')
                .css({
                    position: 'absolute',
                    left: ($element.offset().left - 10) + 'px',
                    top: ($element.offset().top + $element.height()) + 'px',
                    width: ($element.width() + 20) + 'px'
                })
                .append($('<ul/>')
                    .addClass('unstyled')
                    .on('click', 'li', function () {
                        var text = $(this).text();
                        $element.find('.current').text(text).removeClass('default');
                        if (callback) {
                            callback(text);
                        }
                    })
                    .append(_.chain(options)
                        .filter(function (option) {
                            return option.text !== $element.find('.current').text();
                        })
                        .map(function (option) {
                            return $('<li/>')
                                .text(option.text);
                        }).value())
                )
                .appendTo('.container')
        //.hide()
        //.slideToggle('fast')
        ;


        var handler = function () {
            container.remove();
            $element.removeClass('active');

            $('html').off('click', handler);
            $(window).off('resize', handler);
        }

        setTimeout(function () {
            $('html').on('click', handler);
            $(window).on('resize', handler);
        }, 0);

    }

}());