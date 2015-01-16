(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanks', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function FillInTheBlanks(id, title, type, groups) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

            that.groups = groups;

            function answer(answers) {
                var correct = 0;
                _.each(that.groups, function (group) {
                    if (_.find(group.answers, function (answer) {
                        return answer.isCorrect && answers[group.id] === answer.text;
                    })) {
                        correct++;
                    }
                });

                that.score = correct === that.groups.length ? 100 : 0;
            }
        };

    }
}());