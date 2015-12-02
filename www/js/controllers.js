angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CommentsCtrl', function($scope, webService) {
  $scope.parent_id = 0;  
  $scope.ws = webService;
  $scope.ws.getComments().then(function(response){
    $scope.comments = [];
    var list_itens = response.data.data;
    for(var i=0; i<list_itens.length; i++) {
      var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
      $scope.comments.push(item);
    }
  });

  $scope.sendComment = function(comment) {
    $scope.ws.saveComment(comment.text, $scope.parent_id).then(function(response){
      //$scope.comment_data = response.data.data;
      var item_data = response.data.data;
      var item = { title: item_data.text, id: item_data.id, date: item_data.date, parent: item_data.parent, num_comments: 0};
      $scope.comments.unshift(item);
    });
  }

  $scope.doRefresh = function() {
    console.log("Fazendo o refresh");
    $scope.ws.getComments().then(function(response){
      $scope.comments = [];
      var list_itens = response.data.data;
      for(var i=0; i<list_itens.length; i++) {
        var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
        $scope.comments.push(item);
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('CommentCtrl', function($scope, $stateParams, webService) {
  $scope.ws = webService;  
  $scope.ws.showComment($stateParams.id).then(function(response){
    $scope.comment_data = response.data.data;
    $scope.parent_id = response.data.data.id;
    //$scope.$apply();

    $scope.ws.getComments($scope.parent_id).then(function(response){
      $scope.comments = [];
      var list_itens = response.data.data;
      for(var i=0; i<list_itens.length; i++) {
        var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
        $scope.comments.push(item);
      }
    });
  });

  $scope.sendComment = function(comment) {    
    console.log(comment);
    $scope.ws.saveComment(comment.text, $scope.parent_id).then(function(response){
      //$scope.comment_data = response.data.data;
      var item_data = response.data.data;
      var item = { title: item_data.text, id: item_data.id, date: item_data.date, parent: item_data.parent, num_comments: 0};
      $scope.comments.unshift(item);
    });
  }

  $scope.doRefresh = function() {
    console.log("Fazendo o refresh");
    $scope.ws.getComments($scope.parent_id).then(function(response){
      $scope.comments = [];
      var list_itens = response.data.data;
      for(var i=0; i<list_itens.length; i++) {
        var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
        $scope.comments.push(item);
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
    //$scope.$apply();
  };

});