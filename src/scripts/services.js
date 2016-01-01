angular
  .module('appServices', ['ngResource'])
  .factory('Post', ['$resource', function($resource) {
    return $resource('/data/posts.json', {}, {
      query: { method: 'GET', isArray: true }
    });
  }]);