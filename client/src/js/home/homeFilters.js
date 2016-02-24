Neno.CAApp.Home = (function() {
  var homeModule = angular.module('caapp.home');

  homeModule.filter('daysAhead', function ($moment, $sce) {
    return function (date) {
      var now      = $moment({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })  // local midnight today
        , deadline = $moment(date);
      return $sce.trustAsHtml(date ? String(deadline.diff(now, 'days')) : '&mdash;');
    };
  });

  return homeModule;
}());
