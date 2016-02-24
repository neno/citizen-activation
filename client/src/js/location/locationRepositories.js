Neno.CAApp.Location = (function() {
  var locationModule = angular.module('caapp.location');

  // ### Search locations - index of all locations { id, name } to display in search results
  locationModule.factory('SearchLocationsRepository', function ($q, $http, CommonLocalRepository) {
    var storeKey = 'locations.search';

    return {

      list: function (q, options) {
        options = options || 'object' === typeof q ? q : {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (locations) {
            var needsToFetch  = options.fetch || !_.isArray(locations);

            if (!needsToFetch) { return deferred.resolve(locations); }

            $http.get('/locations/searchindex')
              .success(function (data) {
                locations = data;
                CommonLocalRepository.store(storeKey, locations); // fire-and-forget
                deferred.resolve(locations);
              });
          });

        return deferred.promise;
      },
    };
  });


  // ### Content locations - a collection of all locations to fetch for content displaying (user stored + ancestors)
  locationModule.factory('ContentLocationsRepository', function ($q, $http, CommonLocalRepository, UserLocationsRepository, LocationsSortOrder) {
    var storeKey = 'content.locations';

    return {

      list: function (options) {
        options  = options || {};
        var deferred = $q.defer();

        $q.all([
            CommonLocalRepository.fetch(storeKey)
          , UserLocationsRepository.list()
        ]).then(function (results) {
            var contentLocations = results[0]
              , userLocationsIds = results[1]
              , needsToFetch = options.fetch || !_.isEmpty(_.difference(userLocationsIds, _.pluck(contentLocations, '_id')));

            if (!needsToFetch) { return deferred.resolve(contentLocations); }

            $http.post('/locations', { ids: userLocationsIds })
              .success(function (data) {
                contentLocations = data;
                CommonLocalRepository.store(storeKey, contentLocations); // fire-and-forget
                deferred.resolve(contentLocations);
              });
          });

        return deferred.promise;
      },


      ancestors: function (id, options) {
        options = options || {};
        var deferred = $q.defer()
          , sort;

        sort = function (locations) {
          return _.sortBy(locations, function (location) {
            return -LocationsSortOrder[location.level];
          });
        };


        CommonLocalRepository.fetch(storeKey)
          .then(function (locations) {
            var location, ancestorsIds, cached, needsToFetch;

            locations = locations || [];
            location  = _.findWhere(locations, { _id: id });

            if (location) {
              ancestorsIds = _.values(location.ancestors);
              cached = _.where(locations, function (location) {
                return _.contains(ancestorsIds, location._id);
              });
            }

            needsToFetch = options.fetch || _.isUndefined(location) || cached.length !== ancestorsIds.length;

            if (!needsToFetch) { return deferred.resolve(sort(cached)); }

            $http.get(['/locations', id, 'ancestors'].join('/'))
              .success(function (data) {
                var cachedIds = _.pluck(locations, '_id');
                _.each(data, function(location) {
                  if (cachedIds.indexOf(location._id) < 0) {
                    locations.push(location);
                  }
                });
                CommonLocalRepository.store(storeKey, locations); // fire-and-forget
                deferred.resolve(sort(data));
              });
          });

        return deferred.promise;
      },


      get: function (id, options) {
        options = options || {};
        var deferred     = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (locations) {
            var cached, needsToFetch;

            locations    = locations || [];
            cached       = _.findWhere(locations, { _id: id });
            needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            $http.get(['/locations', id].join('/'))
              .success(function (data) {
                locations.push(data);
                CommonLocalRepository.store(storeKey, locations); // fire-and-forget
                deferred.resolve(data);
              });
          });

        return deferred.promise;
      },
    };
  });

  return locationModule;
}());
