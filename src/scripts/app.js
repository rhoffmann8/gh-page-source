(function() {
  var app = angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'angular.filter',
    'appServices',
    'appControllers',
    'appDirectives'
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/partials/home.html',
      controller: 'PostListCtrl'
    }).
    when('/about', {
      templateUrl: '/partials/about.html'
    }).
    when('/posts/:postid', {
      templateUrl: '/partials/post.html',
      controller: 'PostCtrl'
    }).
    when('/stadiums', {
      templateUrl: '/partials/stadiums.html',
      controller: 'StadiumCtrl'
    }).
    when('/projects', {
      templateUrl: '/partials/projects.html',
      controller: 'ProjectCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);

  // hljs.initHighlightingOnLoad();
})();