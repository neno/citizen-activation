Neno.CAApp.Layout = (function() {
  var commonModule = angular.module('caapp.common');


  // ### User locations - a collection of user's stored locations IDs
  commonModule.factory('CacheService', function ($q, UserMetaData, SearchLocationsRepository, ContentLocationsRepository, DeadlinesRepository, NewsRepository, CitizenRightsRepository) {

    return {

      sync: function () {
        var deferred = $q.defer()
          , options = { fetch: true };

        $q.all([
            SearchLocationsRepository.list(options)
          , ContentLocationsRepository.list(options)
          , DeadlinesRepository.list(options)
          , NewsRepository.list(options)
          , CitizenRightsRepository.list(options)
        ]).then(function (results) {
          UserMetaData.synced();
          deferred.resolve();
        });

        return deferred.promise;
      },
    };
  });


  return commonModule;
}());
