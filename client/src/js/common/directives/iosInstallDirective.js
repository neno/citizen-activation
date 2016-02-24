Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.directive('iosInstall', function ($rootScope, $location, $state) {
    return {
      restrict   : 'AC',
      replace    : true,
      templateUrl: '/assets/src/templates/common/_iosinstall.html',
      controller : function($scope, $element, $attrs) {
        $scope.toggle = function () {
          $scope.moreCss = $scope.moreCss ? undefined : 'is-active';
        };
      },
    };
  });

  return commonModule;
}());
