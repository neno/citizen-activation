Neno.CAApp.Location = (function() {
  var locationModule = angular.module('caapp.location');

  locationModule.controller('LocationIndexController', function ($scope, models) {
    var userLocations = models[0]
      , readItems     = models[1]
      , location      = models[2]
      , news          = models[3]
      , deadlines     = models[4]
      , newsIds       = _.pluck(news, '_id')
      , deadlinesIds  = _.pluck(deadlines, '_id');

    $scope.headerTitle     = location.name;
    $scope.location        = location;
    $scope.newsCount       = _.difference(newsIds, readItems).length;
    $scope.deadlinesCount  = _.difference(deadlinesIds, readItems).length;
    $scope.isUserLocation  = _.contains(userLocations, location._id);
    $scope.$parent.bodyCss = ['t-bg', 'location-index', location.theme];
  });


  locationModule.controller('LocationDeadlinesController', function ($scope, models) {
    var readItems      = models[0]
      , location       = models[1]
      , deadlines      = models[2]
      , locationsIndex = models[3];

    deadlines = _.sortBy(deadlines, 'date');
    _.map(deadlines, function (deadline) {
      var location = _.findWhere(locationsIndex, { _id: deadline.location })
        , isUnread = !_.contains(readItems, deadline._id);
      return _.extend(deadline, { locationName: location.name, isUnread: isUnread });
    });

    $scope.headerTitle     = 'Participation Deadlines';
    $scope.location        = location;
    $scope.deadlines       = deadlines;
    $scope.$parent.bodyCss = [location.theme];
  });


  locationModule.controller('LocationNewsController', function ($scope, models) {
    var readItems      = models[0]
      , location       = models[1]
      , news           = models[2]
      , locationsIndex = models[3];

    news = _.sortBy(news, 'date').reverse();
    _.map(news, function (newsItem) {
      var location = _.findWhere(locationsIndex, { _id: newsItem.location })
        , isUnread = !_.contains(readItems, newsItem._id);
      return _.extend(newsItem, { locationName: location.name, isUnread: isUnread });
    });
    $scope.headerTitle     = 'Democracy News';
    $scope.location        = location;
    $scope.news            = news;
    $scope.$parent.bodyCss = [location.theme];
  });


  locationModule.controller('LocationInfoController', function ($scope, models) {
    var location  = models[0]
      , ancestors = models[1]
      , locations = _.union([location], ancestors); // ancestors sorted up the chain, append to location

    $scope.headerTitle     = 'Location Info';
    $scope.location        = location;
    $scope.locations       = locations;
    $scope.contentLocation = location;
    $scope.tabNavShown     = locations.length > 1;
    $scope.$parent.bodyCss = [location.theme];
  });


  locationModule.controller('LocationCitizenRightsController', function ($scope, models) {
    var location      = models[0]
      , citizenRights = models[1];

    $scope.headerTitle     = 'Citizen Rights';
    $scope.location        = location;
    $scope.citizenRights   = citizenRights;
    $scope.$parent.bodyCss = [location.theme];
  });


  locationModule.controller('LocationCitizenRightsItemController', function ($scope, models) {
    var location     = models[0]
      , citizenRight = models[1];

    $scope.headerTitle     = 'Citizen Rights';
    $scope.location        = location;
    $scope.citizenRight    = citizenRight;
    $scope.$parent.bodyCss = [location.theme];
  });

  return locationModule;
}());
