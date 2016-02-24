Neno.CAApp.LocationNews = (function() {
  var newsModule = angular.module('caapp.location.news');

  newsModule.factory('NewsRepository', function ($q, $http, CommonLocalRepository, UserLocationsRepository) {
    var storeKey = 'content.news';

    return {

      list: function(options) {
        options  = options || {};
        var deferred = $q.defer();

        $q.all([
            CommonLocalRepository.fetch(storeKey)
          , UserLocationsRepository.list()
        ]).then(function (results) {
            var news             = results[0] || {}
              , userLocationsIds = results[1]
              , needsToFetch     = options.fetch || !_.isEmpty(_.difference(userLocationsIds, _.keys(news)));

            if (!needsToFetch) { return deferred.resolve(news); }

            $http.post('/locations/content/news', { locationsIds: userLocationsIds })
              .success(function (data) {
                news = _.extend(news, data);
                CommonLocalRepository.store(storeKey, news); // fire-and-forget
                deferred.resolve(news);
              });
          });

        return deferred.promise;
      },


      get: function(locationId, newsId, options) {
        options = options || {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (news) {
            news = news || {};
            var cached       = _.findWhere(news[locationId], { _id: newsId })
              , needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            $http.get(['/news', newsId].join('/'))
              .success(function (data) {
                news[locationId] = news[locationId] || [];
                news[locationId].push(data);
                CommonLocalRepository.store(storeKey, news); // fire-and-forget
                deferred.resolve(_.findWhere(news[locationId], { _id: newsId }));
              });
          });

        return deferred.promise;
      },


      byLocation: function(locationId, options) {
        options = options || {};
        var deferred = $q.defer();

        CommonLocalRepository.fetch(storeKey)
          .then(function (news) {
            news = news || {};
            var cached       = news[locationId]
              , needsToFetch = options.fetch || _.isUndefined(cached);

            if (!needsToFetch) { return deferred.resolve(cached); }

            $http.get(['/locations', locationId, 'news'].join('/'))
              .success(function (data) {
                news[locationId] = data;
                CommonLocalRepository.store(storeKey, news); // fire-and-forget
                deferred.resolve(news[locationId]);
              });
          });

        return deferred.promise;
      },
    };
  });

  return newsModule;
}());
