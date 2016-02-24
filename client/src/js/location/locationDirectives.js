Neno.CAApp.Location = (function() {
  var locationModule = angular.module('caapp.location');

  locationModule.directive('titleBar', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/location/_titlebar.html',
    };
  });

  locationModule.directive('tabbedNavbar', function ($location) {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/location/_tabbednavbar.html',
      controller : function ($scope, $element, $attrs) {
        $scope.selectTab = function (index) {
          $scope.contentLocation = $scope.locations[index];
        };
      }
    };
  });

  locationModule.directive('sidebar', function ($location) {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/location/_sidebar.html',
      controller : function ($scope, $element, $attrs) {
        $scope.$watch(function () { $location.path(); }, function () {
          $scope.isActive = function (navItem) {
            // first fragment empty as path starts with '/', so index is 3
            var contentFragment = $location.path().split('/')[3];
            return navItem === contentFragment;
          };
        });
      }
    };
  });

  locationModule.directive('locationHeader', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/location/_locationheader.html',
    };
  });

  locationModule.directive('democracyRating', function () {
    return {
      restrict   : 'E',
      replace    : true,
      templateUrl: '/assets/src/templates/location/_democracyrating.html',
      scope      : {
        location: '='
      },
      controller : function ($scope, $element, $attrs) {
        $scope.$watch($attrs.location, function (location) {
          var RATING_MAX    = 5
            , ratingIcons   = []
            , ratingFloor
            , ratingModuloPct
            , i;

          location = location || {};
          ratingFloor = Math.floor(location.democracyRating);
          ratingModuloPct = Math.round(location.democracyRating % 1 * 100);

          for (i = 0; i < RATING_MAX; i++) {
            ratingIcons.push({
              cssClass   : i < ratingFloor ? ['rating-item', 'rating-item-full'] : ['rating-item'],
              fillStyle: i === ratingFloor ? ['width:', ratingModuloPct, '%'].join('') : undefined
            });
          }

          $scope.maxRating   = RATING_MAX;
          $scope.rating      = location.democracyRating;
          $scope.ratingIcons = ratingIcons;
        });
      }
    };
  });


  locationModule.directive('saveLocationButton', function (UserLocationsRepository) {
    return {
      restrict  : 'AC',
      controller: function ($scope, $element, $attrs) {
        $element.bind('click', function () {
          var location   = $scope.location;
          $scope.overlay = 'add';
          UserLocationsRepository
            .add(location)
            .then(function (userLocations) {
              $scope.isUserLocation = true;
              $scope.dialogMessage  = 'Location added';
              $scope.showOverlay();
            });
        });
      }
    };
  });

  locationModule.directive('removeLocationButton', function (UserLocationsRepository, $state) {
    return {
      restrict  : 'AC',
      controller: function ($scope, $element, $attrs) {
        $element.bind('click', function () {
          $scope.$apply(function () {
            var location         = $scope.location;
            $scope.overlay       = 'remove';
            $scope.dialogMessage = 'Remove location?';
            $scope.showOverlay();
            $scope.onConfirm = function () {
              return UserLocationsRepository
                .remove(location)
                .then(function (userLocations) {
                  $scope.isUserLocation = false;
                  $state.go('home', undefined, { reload: true });
                });
            };
          });
        });
      }
    };
  });


  locationModule.directive('toggleTitle', function () {
    return {
      restrict  : 'C',
      controller: function ($scope, $element, $attrs) {
        $element.bind('click', function () {
          $scope.$apply(function () {
            $scope.showContent = !$scope.showContent;
          });
        });
      }
    };
  });

  return locationModule;
}());
