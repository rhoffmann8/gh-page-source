angular
  .module('appControllers', [])
  .controller('NavCtrl', ['$scope', '$route', '$location', function($scope, $route, $location) {
    $scope.navItems = [{
      href: '#/',
      text: 'Posts'
    },{
      href: '#/projects',
      text: 'Projects'
    },{
      href: '#/stadiums',
      text: 'Stadiums'
    },{
      href: '#/about',
      text: 'About'
    }];

    $scope.getActive = function(path) {
      if ($location.path() == path.substr(1, path.length)) {
        return 'active';
      }
      return '';
    }
  }])

  .controller('ContactCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/data/contact.json').success(function(data) {
      $scope.contact = data;
    });
  }])

  .controller('PostListCtrl', ['$scope', 'Post', function($scope, Post) {
    $scope.posts = Post.query();
  }])

  .controller('PostCtrl', ['$scope', '$http', '$routeParams', '$location', 'Post', '$sce', 
    function($scope, $http, $routeParams, $location, Post, $sce) {

      var posts = Post.query(function() {
        posts = posts.filter(function(post) {
          return post.id == $routeParams.postid;
        });

        if (!posts.length) {
          $location.path('#/');
        }
        $scope.post = posts[0];

        $http.get('/posts/' + $scope.post.id + '.md').success(function(data) {
          marked.setOptions({
            gfm: true,
            sanitize: false,
            highlight: function (code, lang) {
              return hljs.highlightAuto(code).value;
            }
          });
          $scope.post.content = $sce.trustAsHtml(marked(data));
        });
      });
  }])

  .controller('StadiumCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/data/stadiums.json').success(function(data) {
      $scope.stadiums = data;
    });

    $scope.active = '';

    $scope.handleClick = function(name) {
      if ($scope.active == name) {
        $scope.active = '';
      } else {
        $scope.active = name;
      }
    };
  }])

  .controller('ProjectCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/data/projects.json').success(function(data) {
      $scope.projects = data;
    });
  }])

  .controller('ImgCtrl', ['$scope', '$document', function($scope, $document) {

    function closeOverlay() {
      $('.overlay').off('click').remove();
      $document.find('body').removeClass('noscroll');
      $document.off('keypress');
    }

    $scope.handleClick = function(src) {
      var overlay = $('<div />', {
        class: 'overlay'
      });

      var img = $('<img />', {
        src: src.replace('/thumbs', '')
      }).on('click', function(e) {
        e.stopPropagation();
      });

      overlay.append(img);
      overlay.on('click', closeOverlay);
      $document.on('keydown', function(e) {
        if (e.keyCode == 27) {
          closeOverlay();
        }
      })

      $document.find('body').addClass('noscroll').append(overlay);
    };
  }]);