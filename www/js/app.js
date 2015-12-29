// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'pascalprecht.translate'])

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

    //Google Cloud Message
    var io = Ionic.io();
    var push = new Ionic.Push({
      "onNotification": function(notification) {
        alert('Received push notification!');
      },
      "pluginConfig": {
        "android": {
          "iconColor": "#0000FF"
        }
      }
    });

    push.register(function(data) {
      window.gcm_id = data.token;
      console.log(window.gcm_id);
      push.addTokenToUser(user);
      user.save();
    });
  });
})
.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $translateProvider.useSanitizeValueStrategy('escape');
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
        templateUrl: 'templates/comments.html',
        controller: 'CommentsCtrl'
      }
    }
  });
  
  var locale = window.navigator.language || window.navigator.userLanguage; 
  if (locale === 'pt-BR') {
    lang = 'pt';
  } else {
    lang = 'en';
  }

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/comments');

  // Translation
  $translateProvider.translations('en', {
      TITLE: "Messages",
      VERIFY_CONNECTION: "Please, verify your internet connection.",
      MSG_PLACEHOLDER: "Write whatever that comes to your mind.",
      NO_CONNECTION: "No connection.",
      TOPICS: "Tópics",
      COMMENTS: "comments",
      PULL_REFRESH: "Pull to refresh.",
  });
  $translateProvider.translations('pt', {
      TITLE: "Mensagens",
      VERIFY_CONNECTION: "Por favor, verifique sua conexão de internet.",
      MSG_PLACEHOLDER: "Escreva o que quiser aqui.",
      NO_CONNECTION: "Sem conexão.",
      TOPICS: "Tópicos",
      COMMENTS: "comentários",
      PULL_REFRESH: "Puxe para atualizar.",
  });
  
  $translateProvider.preferredLanguage(lang);
  $translateProvider.fallbackLanguage(lang);  
})

.factory('webService', function($http) {
  //var base_path = "http://localhost/ifeel-ws/";
  var base_path = "http://beecoapp.com/ws-ifeel/";
  return {
    getComments: function(comment_id, start, limit) {      
      comment_id = typeof comment_id !== 'undefined' ? comment_id : 0;
      start = typeof start !== 'undefined' ? start : 0;
      limit = typeof limit !== 'undefined' ? limit : 20;
      var url = String(base_path) + "?service=comment&action=list&comment_id=" + String(comment_id) + "&start=" + String(start) + "&limit=" + String(limit);
      // Adding gcm_id information
      if(window.gcm_id) {
        url = url + "&gcm_id=" + String(window.gcm_id);
      }
      return $http.get(url);
    },
    showComment: function(comment_id) {        
      console.log(comment_id);
      var url = String(base_path) + "?service=comment&action=show&comment_id=" + String(comment_id);
      // Adding gcm_id information
      if(window.gcm_id) {
        url = url + "&gcm_id=" + String(window.gcm_id);
      }     
      return $http.get(url);
    },
    saveComment: function(comment_text, comment_parent, comment_gcm) {
      console.log(comment_parent);
      // default values
      comment_parent = typeof comment_parent !== 'undefined' ? comment_parent : 0;
      comment_gcm = typeof comment_gcm !== 'undefined' ? comment_gcm : null;
      var url = String(base_path) + "?service=comment&action=save";
      // Adding gcm_id information
      if(window.gcm_id) {
        url = url + "&gcm_id=" + String(window.gcm_id);
      }
      return $http.post(
        url, 
        {text : comment_text, parent: comment_parent, gcm: comment_gcm}
      );
    }
  }
});
