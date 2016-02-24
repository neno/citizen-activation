Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.filter('trimUrlPrefix', function () {
    return function (url) {
      return url.replace(/^https?:\/\//i, '');
    };
  });

  return commonModule;
}());


