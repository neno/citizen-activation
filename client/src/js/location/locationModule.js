Neno.CAApp.Location = (function() {
  var locationModule = angular.module('caapp.location', ['ui.router', 'ngResource', 'ngSanitize', 'LocalForageModule']);

  locationModule.config(function ($stateProvider) {
    $stateProvider
      .state('location', {
        url   : '^/locations/:id',
        parent: 'home',
        views : {
          'main@': {
            controller : 'LocationIndexController',
            templateUrl: '/assets/src/templates/location/location.html',
            resolve : {
              models: ['$q', '$stateParams', 'UserLocationsRepository', 'UserReadItemsRepository', 'ContentLocationsRepository', 'NewsRepository', 'DeadlinesRepository', 'CitizenRightsRepository',
              function ($q, $stateParams, UserLocationsRepository, UserReadItemsRepository, ContentLocationsRepository, NewsRepository, DeadlinesRepository, CitizenRightsRepository) {
                return $q.all([
                    UserLocationsRepository.list()
                  , UserReadItemsRepository.list()
                  , ContentLocationsRepository.get($stateParams.id)
                  , NewsRepository.byLocation($stateParams.id)
                  , DeadlinesRepository.byLocation($stateParams.id)
                  // the following are unused, but want to have that data cached on location fetch
                  , CitizenRightsRepository.byLocation($stateParams.id)
                  , ContentLocationsRepository.ancestors($stateParams.id)
                ]);
              }]
            },
          }
        }
      })
      .state('location.deadlines', {
        url  : '/deadlines',
        views: {
          'main@': {
            controller : 'LocationDeadlinesController',
            templateUrl: '/assets/src/templates/location/deadlines.html',
            resolve : {
              models: ['$q', '$stateParams', 'SearchLocationsRepository', 'ContentLocationsRepository', 'DeadlinesRepository', 'UserReadItemsRepository',
              function ($q, $stateParams, SearchLocationsRepository, ContentLocationsRepository, DeadlinesRepository, UserReadItemsRepository) {
                return $q.all([
                    UserReadItemsRepository.list()
                  , ContentLocationsRepository.get($stateParams.id)
                  , DeadlinesRepository.byLocation($stateParams.id)
                  , SearchLocationsRepository.list()
                ]);
              }]
            },
          }
        }
      })
      .state('location.news', {
        url  : '/news',
        views: {
          'main@': {
            controller : 'LocationNewsController',
            templateUrl: '/assets/src/templates/location/news.html',
            resolve : {
              models: ['$q', '$stateParams', 'SearchLocationsRepository', 'ContentLocationsRepository', 'NewsRepository', 'UserReadItemsRepository',
              function ($q, $stateParams, SearchLocationsRepository, ContentLocationsRepository, NewsRepository, UserReadItemsRepository) {
                return $q.all([
                    UserReadItemsRepository.list()
                  , ContentLocationsRepository.get($stateParams.id)
                  , NewsRepository.byLocation($stateParams.id)
                  , SearchLocationsRepository.list()
                ]);
              }]
            },
          }
        }
      })
      .state('location.info', {
        url  : '/info',
        views: {
          'main@': {
            controller : 'LocationInfoController',
            templateUrl: '/assets/src/templates/location/info.html',
            resolve : {
              models: ['$q', '$stateParams', 'ContentLocationsRepository',
              function ($q, $stateParams, ContentLocationsRepository) {
                return $q.all([
                    ContentLocationsRepository.get($stateParams.id)
                  , ContentLocationsRepository.ancestors($stateParams.id)
                ]);
              }]
            },
          }
        }
      })
      .state('location.citizenRights', {
        url  : '/citizen-rights',
        views: {
          'main@': {
            controller: 'LocationCitizenRightsController',
            templateUrl: '/assets/src/templates/location/citizen-rights.html',
            resolve : {
              models: ['$q', '$stateParams', 'ContentLocationsRepository', 'CitizenRightsRepository',
              function ($q, $stateParams, ContentLocationsRepository, CitizenRightsRepository) {
                return $q.all([
                    ContentLocationsRepository.get($stateParams.id)
                  , CitizenRightsRepository.byLocation($stateParams.id)
                ]);
              }]
            },
          }
        }
      })
      .state('location.citizenRights.item', {
        url  : '/:citizenRightsId',
        views: {
          'main@': {
            controller : 'LocationCitizenRightsItemController',
            templateUrl: '/assets/src/templates/location/citizen-rights.item.html',
            resolve : {
              models: ['$q', '$stateParams', 'ContentLocationsRepository', 'CitizenRightsRepository',
              function ($q, $stateParams, ContentLocationsRepository, CitizenRightsRepository) {
                return $q.all([
                    ContentLocationsRepository.get($stateParams.id)
                  , CitizenRightsRepository.get($stateParams.id, $stateParams.citizenRightsId)
                ]);
              }]
            },
          }
        }
      });
  });

  return locationModule;
}());
