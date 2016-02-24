Neno.CAApp.Location = (function() {
  var locationModule = angular.module('caapp.location');

  locationModule.directive('markItemRead', function (UserReadItemsRepository) {
    return {
      restrict  : 'AC',
      scope: {
        item: '='
      },
      controller: function ($scope, $element, $attrs) {
        UserReadItemsRepository.markRead($scope.item);
        // no need to nest under a promise, fire-and-forget storing is enough here
        $scope.item.isUnread = false;
      }
    };
  });


  return locationModule;
}());
