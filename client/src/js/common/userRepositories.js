Neno.CAApp.Layout = (function() {
  var commonModule = angular.module('caapp.common');

  // ### User's meta data
  commonModule.factory('UserMetaDataRepository', function (CommonLocalRepository) {
    var storeKey = 'user.metaData';

    return {

      fetch: function () {
        return CommonLocalRepository.fetch(storeKey);
      },

      store: function (metaData) {
        return CommonLocalRepository.store(storeKey, metaData);
      },
    };
  });


  // ### User locations - a collection of user's stored locations IDs
  commonModule.factory('UserLocationsRepository', function (CommonLocalRepository) {
    var storeKey = 'user.storedLocations';

    return {

      list: function () {
        return CommonLocalRepository.fetch(storeKey);
      },

      add: function (location) {
        return CommonLocalRepository.add(storeKey, location._id);
      },

      remove: function (location) {
        return CommonLocalRepository.remove(storeKey, location._id);
      },
    };
  });


  commonModule.factory('UserReadItemsRepository', function (CommonLocalRepository) {
    var storeKey = 'user.readItems';

    return {

      list: function () {
        return CommonLocalRepository.fetch(storeKey);
      },

      markRead: function (location) {
        return CommonLocalRepository.add(storeKey, location._id);
      },
    };
  });


  return commonModule;
}());
