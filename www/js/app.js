// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.comments', {
      url: '/comments',
      views: {
        'menuContent': {
          templateUrl: 'templates/comments.html',
          controller: 'CommentsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/comment/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/comment.html',
        controller: 'CommentCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/comments');
})

.factory('webService', function($http) {
  //var base_path = "http://localhost/ifeel-ws/";
  var base_path = "http://beecoapp.com/ws-ifeel/";
  return {
    getComments: function(comment_id) {
      comment_id = typeof comment_id !== 'undefined' ? comment_id : 0;
      return $http.get(String(base_path) + "?service=comment&action=list&comment_id=" + String(comment_id));
    },
    showComment: function(comment_id) {        
      return $http.get(String(base_path) + "?service=comment&action=show&comment_id=" + String(comment_id));
    },
    saveComment: function(comment_text, comment_parent, comment_gcm) {
      console.log(comment_parent);
      // default values
      comment_parent = typeof comment_parent !== 'undefined' ? comment_parent : 0;
      comment_gcm = typeof comment_gcm !== 'undefined' ? comment_gcm : null;

      return $http.post(
        String(base_path) + "?service=comment&action=save", 
        {text : comment_text, parent: comment_parent, gcm: comment_gcm}
      );
    }
  }
});
