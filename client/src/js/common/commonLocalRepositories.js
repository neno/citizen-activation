Neno.CAApp.Layout = (function() {
  var commonModule = angular.module('caapp.common');

  // ### Common local repository operations
  commonModule.factory('CommonLocalRepository', function ($q, $localForage) {
    var fetch, store, add, remove;

    fetch = function (storeKey) {
      return $localForage.get(storeKey);
    };

    store = function (storeKey, items) {
      return $localForage.setItem(storeKey, items);
    };

    add = function (storeKey, itemId) {
      var deferred = $q.defer();
      fetch(storeKey)
        .then(function (items) {
          items = items || [];
          if (_.contains(items, itemId)) { return deferred.resolve(items); }
          items.push(itemId);
          store(storeKey, items).then(deferred.resolve);
        });

      return deferred.promise;
    };

    remove = function (storeKey, itemId) {
      var deferred = $q.defer();
      fetch(storeKey)
        .then(function (items) {
          items = items || [];
          if (!_.contains(items, itemId)) { return deferred.resolve(items); }
          items = _.compact(_.without(items, itemId));
          store(storeKey, items).then(deferred.resolve);
        });

      return deferred.promise;
    };

    return {
      fetch : fetch,
      store : store,
      add   : add,
      remove: remove,
    };
  });


  return commonModule;
}());
