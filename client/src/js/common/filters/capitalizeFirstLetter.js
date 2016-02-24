Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.filter('capitalizeFirstLetter', function () {
    return function (string) {
      return string && string.charAt(0).toUpperCase() + string.slice(1);
    };
  });

  return commonModule;
}());


