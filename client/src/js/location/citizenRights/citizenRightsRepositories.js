Neno.CAApp.LocationCitizenRights = (function() {
  var citizenRightsModule = angular.module('caapp.location.citizenRights');

  citizenRightsModule.factory('CitizenRightsRepository', function ($q, $http, CommonLocalRepository, UserLocationsRepository) {
    var storeKey = 'content.citizenRights';

    return {

      list: function(options) {
        options  = options || {};
        var deferred = $q.defer();

        $q.all([
            CommonLocalRepository.fetch(storeKey)
          , UserLocationsRepository.list()
        ]).then(function (results) {
            var citizenRights    = results[0] || {}
              , userLocationsIds = results[1]
              , needsToFetch = options.fetch || !_.isEmpty(_.difference(userLocationsIds, _.keys(citizenRights)));

            if (!needsToFetch) { return deferred.resolve(citizenRights); }

            $http.post('/locations/content/civilRights', { locationsIds: userLocationsIds })
              .success(function (data) {
                citizenRights = _.extend(citizenRights, data);
                CommonLocalRepository.store(storeKey, citizenRights); // fire-and-forget
                deferred.resolve(citizenRights);
              });
          });

        return deferred.promise;
      },


      get: function(locationId, citizenRightsId, options) {
        options = options || {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (citizenRights) {
            citizenRights = citizenRights || {};
            var cached       = _.findWhere(citizenRights[locationId], { _id: citizenRightsId })
              , needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            $http.get(['/civilRights', citizenRightsId].join('/'))
              .success(function (data) {
                citizenRights[locationId] = citizenRights[locationId] || [];
                citizenRights[locationId].push(data);
                CommonLocalRepository.store(storeKey, citizenRights); // fire-and-forget
                deferred.resolve(_.findWhere(citizenRights[locationId], { _id: citizenRightsId }));
              });
          });

        return deferred.promise;
      },


      byLocation: function(locationId, options) {
        options = options || {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (citizenRights) {
            citizenRights = citizenRights || {};
            var cached       = citizenRights[locationId]
              , needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            // DB collection name: civilRights
            $http.get(['/locations', locationId, 'civilRights'].join('/'))
              .success(function (data) {
                citizenRights[locationId] = data;
                CommonLocalRepository.store(storeKey, citizenRights); // fire-and-forget
                deferred.resolve(citizenRights[locationId]);
              });
          });

        return deferred.promise;
      },
    };
  });

  return citizenRightsModule;
}());
