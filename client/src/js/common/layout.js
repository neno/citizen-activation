Neno.CAApp.Common = (function() {
  var commonModule = angular.module('caapp.common');

  commonModule.directive('content', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: function(el, attrs) {
        return attrs.templateUrl || '/assets/src/templates/common/layout.html';
      }
    };
  });

  return commonModule;
}());
