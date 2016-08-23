angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope,$state, $firebaseArray, $firebaseObject, FireBaseService,LoginService,Chats) {
    var self = this;
    
    self.init = function(){
      self.currentUser=null;
      Chats.getCurrentUser(function(user){
          $scope.$apply(function() {
            self.currentUser=user;
          })
      })
    }
    self.login=function(){
      LoginService.login(function(user) {
        self.friends=Chats.getFriends();
        // $state.go('tab.chats');
      });
    }
    self.chatWith=function(email){
      Chats.send(email,self.currentUser.email,'Hi');
      $state.go('tab.chats');
    }

  })

  .controller('ChatsCtrl', function ($scope,$state, Chats) {
    var self=this;
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    self.init=function(){
      // Chats.send('loveloveforever1306@gmailcom','nt@gmailcom','active');
      // Chats.send('nt@gmailcom','loveloveforever1306@gmailcom','active');
      Chats.getFriends(function(friends){
        if(friends===null){
          $state.go('tab.dash');
        }
        self.friends=friends;
      });
    }
    self.chatOne = function(friend) {
      $state.go('tab.chat-detail',{friend:friend});
    }

  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams,$ionicScrollDelegate,$firebaseAuth, Chats,$timeout) {
    var self=this;
    self.now=new Date().getTime();
    self.friend=$stateParams.friend;
    self.message='';
    var user=firebase.auth().currentUser;
    var userMessageScroll=$ionicScrollDelegate.$getByHandle('userMessageScroll');
    self.init=function(){
      $timeout(function(){
       userMessageScroll.scrollBottom();
      })
    }
    self.sendMessage=function() {
      Chats.send(self.friend.$id,user.email,self.message);
      self.message='';
    }
  })

  .controller('AccountCtrl', function ($scope,$state,Chats,$firebaseAuth) {
    var self=this;
    var auth = $firebaseAuth();
    self.init=function(){
     Chats.getCurrentUser(function(user){
       if(user===null){
         $state.go('tab.dash');
       }
     })
    }
     self.logout=function(){
       auth.$signOut();
       $state.go('tab.dash');
     }
    $scope.settings = {
      enableFriends: true
    };
  });
