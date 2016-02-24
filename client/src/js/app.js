// ========================================
// ##### APPLICATION BOOTSTRAP MODULE #####
// ========================================
// These are app-wide dependencies that are required to assemble your app.
// see https://github.com/ngbp/ng-boilerplate/tree/v0.3.1-release/src/app

// Declaring all modules here that will be used in the application
// so that plain concat can be done instead of dependency resolving Require.js.
// In case app.js is not the first file, move to _declarations.js or similar
// Origin: http://stackoverflow.com/questions/17082092/

// ##### Namespaces definitions
var Neno;
Neno       = Neno || {};
Neno.CAApp = Neno.CAApp || {};

// ##### Global app definition; handles all global behaviour
Neno.CAApp.start = (function() {
  var start, init;

  // ### create modules that need to be created up-front
  angular.module('caapp.templates', []);  // required by the ng-templates cache

  start = function() {
    var app = init();

    // ### bootstraping global app ('ca') and submodules :: http://stackoverflow.com/questions/15294321
    angular.element(document).ready(function() {
      document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace(/\bis-index\b/, '').trim();
      angular.bootstrap(document, [
          'caapp.app'
        , 'caapp.templates'
        , 'caapp.common'
        , 'caapp.home'
        , 'caapp.location'
        , 'caapp.location.news'
        , 'caapp.location.deadlines'
        , 'caapp.location.citizenRights'
      ]);
    });

    return app;
  };

  init = function() {
    var app = angular.module('caapp.app', ['ui.router', 'LocalForageModule', 'angular-momentjs', 'angularMoment', 'caapp.common']);

    app.constant('angularMomentConfig', { preprocess: 'utc' });

    // global routing
    app.config(function ($urlRouterProvider, $locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
      $urlRouterProvider
         // @TODO app-wide undefined route fallback should redirect to 404 page
        .otherwise('/');  // fallback route redirects home
    });

    // angular-localForage config
    app.config(function($localForageProvider) {
      $localForageProvider.config({
        name       : 'Neno.CAApp',  // name of the database and prefix for your data
        storeName  : 'data',        // name of the table
        description: 'Citizen Activation App'
      });
    });

    app.run(function ($rootScope) {
      var isIos, isSafari, isInstalled;

      // pick up bootstrap data from HTML body & delete it from there
      $rootScope.appConfig = window.appBootstrap.appConfig || {};
      $rootScope.appData   = window.appBootstrap.appData || {};
      delete window.appBootstrap;

      // configure globals
      $rootScope.headerTitle = $rootScope.appConfig.appTitle;
      $rootScope.bodyCss     = [];

      // iOS app install detection
      isIos       = /(iPad|iPhone|iPod)/ig.test(window.navigator.userAgent);
      isSafari    = /(Safari)/ig.test(window.navigator.userAgent) && !/(CriOS)/ig.test(window.navigator.userAgent) && /Apple Computer, Inc./.test(window.navigator.vendor);
      isInstalled = window.navigator.standalone;
      $rootScope.isInstallable = isIos && isSafari && !isInstalled;

      // modal overlays show/hide utility functions
      $rootScope.showOverlay = function () {
        this.bodyCss.push('is-overlay-active');
      };

      $rootScope.dismissOverlay = function () {
        this.bodyCss.splice(this.bodyCss.indexOf('is-overlay-active', 1));
      };
    });

    // prefetch data
    app.run(function ($rootScope, $q, UserMetaData, CacheService) {
      $rootScope.$on('$stateChangeStart', function(next, current) {
        $q.when(UserMetaData.needsSync()).then(function (needsSync) {
          $rootScope.lastUpdate = UserMetaData.get('lastSync');
          if (needsSync) {
            $rootScope.isUpdating = true;
            CacheService.sync().then(function () {
              $rootScope.isUpdating = false;
              $rootScope.lastUpdate = UserMetaData.get('lastSync');
            });
          }
        });
      });
    });

    // scroll to top fix on view changed
    // http://stackoverflow.com/questions/21711939
    app.run(function ($rootScope) {
      $rootScope.$on('$viewContentLoaded', function(){
        var interval = setInterval(function () {
          if ('complete' === document.readyState) {
              window.scrollTo(0, 0);
              clearInterval(interval);
          }
        }, 50);
      });
    });

    return app;
  };

  return start;
}());
