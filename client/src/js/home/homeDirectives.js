Neno.CAApp.Home = (function() {
  var homeModule = angular.module('caapp.home');

  homeModule.directive('updateInfo', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/home/_updateinfo.html',
    };
  });


  homeModule.directive('addLocationButton', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/home/_button.addlocation.html',
      controller : function($scope, $element, $attrs) {

        $scope.showModal = function () {
          $scope.showOverlay();
        };
      }
    };
  });


  homeModule.directive('addLocationOverlay', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/home/_addlocation.html',
      controller : function($scope, $element, $attrs, $state) {

        $scope.search = function () {
          var q = $scope.q.toLowerCase();

          $scope.results = !q.length ? [] : _.filter($scope.searchIndex, function (location) {
            return 0 === location.name.toLowerCase().indexOf(q);  // starts-with logic
          });
        };

        $scope.reset = function () {
          $scope.q = '';
          $scope.results = [];
        };

        $scope.close = function () {
          $scope.reset();
          $scope.dismissOverlay();
        };

        $scope.results = [];
      }
    };
  });

  return homeModule;
}());
