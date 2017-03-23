(function () {

    angular
        .module('assessment')
        .controller('ImagePreviewController', ImagePreviewController);

    ImagePreviewController.$inject = ['$scope', '$rootScope', 'imagePreviewFactory'];

    function ImagePreviewController($scope, $rootScope, imagePreviewFactory) {
        var that = this;

        that.imageUrl = undefined;
        that.visible = false;

        that.show = function (imageUrl) {
            that.visible = true;
            that.imageUrl = imageUrl;
        }

        that.hide = function () {
            that.visible = false;
        }

        that.forceHide = function() {
            that.hide();
            $scope.$apply();
        }

        var unbind = $rootScope.$on(imagePreviewFactory.showEventName, function (event, imageUrl) {
            that.show(imageUrl);
        });
        $scope.$on('$destroy', unbind);
    }

}());