(function () {

    angular.module('assessment')
      .directive('statementItem', statementItem);

    function statementItem() {
        return {
            restrict: 'A',
            scope: {
                question: '=',
                statement: '='
            },
            templateUrl: 'app/views/statementItem.html'
        };
    }

}());