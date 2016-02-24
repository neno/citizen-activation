Neno.CAApp.Layout = (function() {
  var commonModule = angular.module('caapp.common');


  // ### User locations - a collection of user's stored locations IDs
  commonModule.factory('UserMetaData', function ($q, $moment, UserMetaDataRepository) {
    var metaDataPromise = UserMetaDataRepository.fetch()
      , getValue, storeLastSync, needsSync
      , metaData;

    metaDataPromise.then(function (data) {
      metaData = data || {};
    });

    getValue = function (key) {
      return key ? metaData[key] : metaData;
    };

    needsSync = function () {
      return metaData.lastSync ? $moment().diff(metaData.lastSync, 'hours', true) >= 24 : true;
    };

    storeLastSync = function () {
      metaData.lastSync = new Date();
      return UserMetaDataRepository.store(metaData);
    };


    return {

      get: function (key) {
        if (metaData) { return getValue(key); }
        var deferred = $q.defer();
        metaDataPromise.then(function () {
          deferred.resolve(getValue(key));
        });
        return deferred.promise;
      },

      needsSync: function () {
        if (metaData) { return needsSync(); }
        var deferred = $q.defer();
        metaDataPromise.then(function () {
          deferred.resolve(needsSync());
        });
        return deferred.promise;
      },

      synced: function () {
        if (metaData) { return storeLastSync(); }
        var deferred = $q.defer();
        metaDataPromise.then(function () {
          deferred.resolve(storeLastSync());
        });
        return deferred.promise;
      },
    };
  });


  return commonModule;
}());
