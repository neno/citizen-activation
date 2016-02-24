Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.directive('notificationDialog', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/common/_notificationDialog.html',
      controller : function($scope, $element, $attrs, $state) {
        $scope.dismiss = function () {
          $scope.dialogMessage = undefined;
          $scope.dismissOverlay();
        };
      },
    };
  });

  commonModule.directive('confirmationDialog', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/common/_confirmationDialog.html',
      controller : function($scope, $element, $attrs, $state) {

        $scope.confirm = function () {
          var cleanup = function () {
            $scope.dialogMessage = undefined;
            $scope.dismissOverlay();
          };
          return $scope.onConfirm ? $scope.onConfirm().then(cleanup) : cleanup();
        };

        $scope.cancel = function () {
          $scope.dismissOverlay();
        };
      },
    };
  });

  return commonModule;
}());


