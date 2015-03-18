'use strict';

var app = angular.module('Midify', ['ngRoute', 'ngCookies', 'ngMaterial', 'btford.socket-io']);

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
});

// Material Color Configuration
app.config(function ($mdThemingProvider) {
  var defaultTheme = $mdThemingProvider.theme('default');

  // Primary Scheme
  defaultTheme.primaryPalette('red', {
    'default': '500',
    'hue-1': 'A200',
    'hue-2': 'A400',
    'hue-3': '200'
  })

  // Accent Scheme

  // Warn Scheme 
});

app.factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  }
)

app.run(function ($rootScope, Auth) {
  $rootScope.Auth = Auth;
});
