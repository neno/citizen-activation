Neno.CAApp.LocationCitizenRights = (function() {
  var citizenRightsModule = angular.module('caapp.location.citizenRights');

  citizenRightsModule.filter('localNameLabelled', function () {
    return function (localName) {
      return ['Local name:', localName].join(' ');
    };
  });

  citizenRightsModule.filter('politicalLevelLabelled', function () {
    return function (level) {
      return ['Political level:', level].join(' ');
    };
  });

  return citizenRightsModule;
}());


