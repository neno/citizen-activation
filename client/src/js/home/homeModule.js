Neno.CAApp.Home = (function() {
  var homeModule = angular.module('caapp.home', ['ui.router', 'ngResource', 'angular-momentjs', 'caapp.location', 'LocalForageModule']);

  homeModule.config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url  : '/',
        views: {
          'main@': {
            controller : 'HomeController',
            templateUrl: '/assets/src/templates/home/home.html',
            resolve    : {
              models: ['$q', 'SearchLocationsRepository', 'ContentLocationsRepository', 'NewsRepository', 'DeadlinesRepository', 'UserLocationsRepository', 'UserReadItemsRepository', 'UserMetaData',
              function ($q, SearchLocationsRepository, ContentLocationsRepository, NewsRepository, DeadlinesRepository, UserLocationsRepository, UserReadItemsRepository, UserMetaData) {
                return $q.all([
                    UserLocationsRepository.list()
                  , UserReadItemsRepository.list()
                  , SearchLocationsRepository.list()
                  , ContentLocationsRepository.list()
                  , NewsRepository.list()
                  , DeadlinesRepository.list()
                ]);
              }]
            }
          }
        }
      });
  });

  return homeModule;
}());
