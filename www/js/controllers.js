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
  $scope.errors = [];

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

.controller('CommentsCtrl', function($scope, $stateParams, webService) {
  $scope.parents = [];
  $scope.connected = 1;
  $scope.scroll_position = 0;
  $scope.comments = [];
  $scope.start_position = 0;
  $scope.errors = [];
  $scope.parent_id = 0;
  $scope.ws = webService;

  $scope.addLog = function(message) {
    if(typeof message == 'object') {
      for(var prop in message){
        $scope.addLog("============");
        $scope.addLog(prop);
        $scope.addLog(message[prop]);
        //var d = new Date();
        //var log_item = String($scope.errors.length) + " - [ LOG ] " + d.toLocaleString() + " - " +String(message[prop]);
        //$scope.errors.push(log_item);        
      }
    } else {
      var d = new Date();
      var log_item = String($scope.errors.length) + " - [ LOG ] " + d.toLocaleString() + " - " +String(message);
      $scope.errors.push(log_item);
    }
  }

  if($stateParams.id) {
    // Comentarios de um topico
    $scope.ws.showComment($stateParams.id).then(function(response){
      console.log(response.data.data.parent_list);
      $scope.parents = response.data.data.parent_list;
      $scope.connected = 1;
      $scope.errors = []; // Clear log errors
      $scope.comment_data = response.data.data;
      $scope.parent_id = response.data.data.id;
      $scope.ws.getComments($scope.parent_id).then(function(response){
        var list_itens = response.data.data;
        for(var i=0; i<list_itens.length; i++) {
          var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
          $scope.comments.push(item);
        }
      });
    },
      function(data) {
        // On error
        if(data.status == 0) {
          //$scope.addLog("Modo Offline");
          $scope.connected = 0;
        }
      }
    );
  } else {
    // Tópicos
    $scope.ws.getComments(0, $scope.start_position).then(function(response){
      $scope.connected = 1;
      $scope.errors = []; // Clear log errors
      var list_itens = response.data.data;
      for(var i=0; i<list_itens.length; i++) {
        var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
        $scope.comments.push(item);
      }
    },
    function(data) {
        // On error
        if(data.status == 0) {
          //$scope.addLog("Modo Offline");
          $scope.connected = 0;
        }
    });    
  }

  $scope.sendComment = function(comment) {
    $scope.ws.saveComment(comment.text, $scope.parent_id).then(function(response){
      //$scope.comment_data = response.data.data;
      var item_data = response.data.data;
      var item = { title: item_data.text, id: item_data.id, date: item_data.date, parent: item_data.parent, num_comments: 0};
      $scope.comments.unshift(item);
    });
  }

  $scope.doRefresh = function() {
    $scope.ws.getComments($scope.parent_id).then(
      function(response){
        $scope.connected = 1;
        $scope.errors = []; // Clear log errors
        $scope.comments = [];
        var list_itens = response.data.data;
        for(var i=0; i<list_itens.length; i++) {
          var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
          $scope.comments.push(item);
        }
      },
      function(data){
        // On error
        if(data.status == 0) {
          //$scope.addLog("Modo Offline");
          $scope.connected = 0;
        }
      }
    );
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.scrollFinish = function(scrollTop, scrollLeft) {
    /*
    console.log('onScrollComplete');
    console.log(scrollTop);
    console.log(scrollLeft);
    */
    if(scrollTop > $scope.scroll_position) {      
      $scope.ws.getComments(0, $scope.start_position).then(function(response){
        $scope.connected = 1;
        $scope.errors = []; // Clear log errors
        var list_itens = response.data.data;        
        if(list_itens[0].id != null) {
          // Evita colocar itens vazios
          for(var i=0; i<list_itens.length; i++) {            
            var item = { title: list_itens[i].text, id: list_itens[i].id, date: list_itens[i].date, num_comments: list_itens[i].num_comments};
            $scope.comments.push(item);
            $scope.start_position = $scope.start_position + 1;
          }
        }
      },
        function(data){
          // On error
          if(data.status == 0) {
            //$scope.addLog("Modo Offline");
            $scope.connected = 0;
          }
        }
      );

      $scope.scroll_position = scrollTop;
    }    
  };  
});