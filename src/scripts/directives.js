angular.module('appDirectives', [])
  .directive('stadium', function() {
    return {
      scope: true,
      restrict: 'E',
      transclude: true,
      templateUrl: '/templates/stadium.html'
    };
  });