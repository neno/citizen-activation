Neno.CAApp.LocationNews = (function() {
  var newsModule = angular.module('caapp.location.news');

  newsModule.filter('authoredBy', function () {
    return function (author) {
      return ['by', author].join(' ');
    };
  });

  return newsModule;
}());


