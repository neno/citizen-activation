Neno.CAApp.LocationDeadlines = (function() {
  var deadlinesModule = angular.module('caapp.location.deadlines');

  deadlinesModule.factory('DeadlinesRepository', function ($q, $http, CommonLocalRepository, UserLocationsRepository) {
    var storeKey = 'content.deadlines';

    return {

      list: function(options) {
        options  = options || {};
        var deferred = $q.defer();

        $q.all([
            CommonLocalRepository.fetch(storeKey)
          , UserLocationsRepository.list()
        ]).then(function (results) {
            var deadlines        = results[0] || {}
              , userLocationsIds = results[1]
              , needsToFetch = options.fetch || !_.isEmpty(_.difference(userLocationsIds, _.keys(deadlines)));

            if (!needsToFetch) { return deferred.resolve(deadlines); }

            $http.post('/locations/content/deadlines', { locationsIds: userLocationsIds })
              .success(function (data) {
                deadlines = _.extend(deadlines, data);
                CommonLocalRepository.store(storeKey, deadlines); // fire-and-forget
                deferred.resolve(deadlines);
              });
          });

        return deferred.promise;
      },


      byLocation: function(locationId, options) {
        options = options || {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (deadlines) {
            deadlines = deadlines || {};
            var cached       = deadlines[locationId]
              , needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            $http.get(['/locations', locationId, 'deadlines'].join('/'))
              .success(function (data) {
                deadlines[locationId] = data;
                CommonLocalRepository.store(storeKey, deadlines); // fire-and-forget
                deferred.resolve(deadlines[locationId]);
              });
          });

        return deferred.promise;
      },
    };
  });

  return deadlinesModule;
}());
