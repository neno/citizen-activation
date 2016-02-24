Neno.CAApp.Location = (function() {
  var locationServices = angular.module('caapp.location');

  locationServices.factory('LocationsSortOrder', function () {
    var sortOrder = { transnational: 1, national: 2, regional: 3, local: 4 };
    return sortOrder;
  });

  return locationServices;
}());
