Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.directive('homeButton', function ($rootScope, $location, $state) {
    return {
      restrict  : 'AC',
      controller: function($scope, $element, $attrs) {
        $scope.isHomeButtonVisible = $state.$current.parent.navigable;  // don't show home button on homepage
        // explicitly taking over the click to force reload
        $element.bind('click', function () {
          $state.go('home', undefined, { reload: true });
        });
      },
    };
  });


  commonModule.directive('backButton', function ($rootScope, $location, $state) {
    return {
      restrict  : 'AC',
      controller: function($scope, $element, $attrs) {
        $scope.isBackButtonVisible = $state.$current.parent.navigable;  // don't show back button on homepage
        $element.bind('click', function () {
          $state.go('^', undefined, { reload: true });  // '^' denotes parent state
        });
      },
    };
  });


  commonModule.directive('refreshButton', function ($rootScope, $location, $state, UserMetaData, CacheService) {
    return {
      restrict  : 'AC',
      controller: function($scope, $element, $attrs) {
        $scope.isRefreshButtonVisible = !$state.$current.parent.navigable;  // show back button only on homepage
        $element.bind('click', function () {
          $rootScope.isUpdating = true;
          CacheService.sync().then(function () {
            $rootScope.isUpdating = false;
            $rootScope.lastUpdate = UserMetaData.get('lastSync');
          });
        });
      },
    };
  });

  return commonModule;
}());


