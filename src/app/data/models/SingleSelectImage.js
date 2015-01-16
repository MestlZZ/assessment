(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImage', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectImage(id, title, type, answers, correctAnswerId) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

            that.correctAnswerId = correctAnswerId;

            that.options = answers;

            function answer(selectedOptionId) {
                that.score = selectedOptionId === that.correctAnswerId ? 100 : 0;
            }
        };
    }

}());