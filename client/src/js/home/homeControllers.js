Neno.CAApp.Home = (function() {
  var homeModule = angular.module('caapp.home');

  homeModule.controller('HomeController', function ($scope, LocationsSortOrder, models) {
    var userLocations = models[0]
      , readItems     = models[1]
      , searchIndex   = models[2]
      , locations     = models[3]
      , news          = models[4]
      , deadlines     = models[5]
      , nextDeadlineLocation;

    // ### Calculate and set nearest deadline to all locations
    _.each(locations, function (location) {
      var newsIds, deadlinesIds, locationItemsIds, closestDeadline;

      closestDeadline = _.reduce(deadlines[location._id], function (nextDeadline, deadline) {
        return (!nextDeadline || deadline.date < nextDeadline.date) ? deadline : nextDeadline;
      });

      newsIds          = _.pluck(news[location._id], '_id');
      deadlinesIds     = _.pluck(deadlines[location._id], '_id');
      locationItemsIds = _.union(newsIds, deadlinesIds);

      // we might have no deadline data for some locations (if no deadlines entries in DB)
      location.nextDeadline = closestDeadline && closestDeadline.date;
      location.updatesCount = _.difference(locationItemsIds, readItems).length;
    });

    nextDeadlineLocation = _.reduce(locations, function (nextDeadlineLocation, location) {
      // finds the highest level location closest to the deadline (or exact)
      if (!nextDeadlineLocation || !nextDeadlineLocation.nextDeadline) { return location; }
      if (!location.nextDeadline) { return nextDeadlineLocation; }
      if (location.nextDeadline === nextDeadlineLocation.nextDeadline) {
        return LocationsSortOrder[location.level] < LocationsSortOrder[nextDeadlineLocation.level] ? location : nextDeadlineLocation;
      }
      return (location.nextDeadline < nextDeadlineLocation.nextDeadline) ? location : nextDeadlineLocation;
    });

    // filter user stored locations by Ids
    userLocations = _.filter(locations, function (location) {
      return _.contains(userLocations, location._id);
    });

    // ### Put view data on the scope
    $scope.locations            = userLocations;
    $scope.nextDeadlineLocation = nextDeadlineLocation;
    $scope.searchIndex          = searchIndex;
    $scope.$parent.bodyCss      = ['home'];
  });

  return homeModule;
}());
