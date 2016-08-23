angular.module('starter.services', [])

  .factory('Chats', function ($firebaseArray, Utils) {
    // Might use a resource here that returns a JSON array
    var self = this;


    self._function = {
      send: function(to, from, content) {
        to = Utils.removeSpecialCharacter(to);
        from = Utils.removeSpecialCharacter(from);
        var ref=firebase.database().ref(refUrl);
        //push to sender
        ref.child(to).child(from).push({
          content: content,
          sendTime:firebase.database.ServerValue.TIMESTAMP,
          isSender:true
        });
        //push to receive
        ref.child(from).child(to).push({
          content: content,
          sendTime:firebase.database.ServerValue.TIMESTAMP,
          isSender:false
        });
      },
      getFriends: function(callback) {
        firebase.auth().onAuthStateChanged(function(user){
          if (user) {
            var refData = firebase.database().ref(refUrl).child(Utils.removeSpecialCharacter(user.email));
            callback($firebaseArray(refData));
          }else {
            callback(null);
          }
        });
      },
      getGroup:function(groupName){
        var refData = firebase.database().ref(refUrl+'groups/').child(groupName);
        return $firebaseArray(refData);
      },
       getCurrentUser:function(callback){
          firebase.auth().onAuthStateChanged(callback);
        }
    };
    return self._function;
  })

  .factory('FireBaseService', function() {
    return {
      getFirebase: function(){
        var config = {
          apiKey: "AIzaSyCeGzkXHA043P2zALXe8yNfO-iX9pti_cE",
          authDomain: "web-firebase-b3e90.firebaseapp.com",
          databaseURL: "https://web-firebase-b3e90.firebaseio.com",
          storageBucket: "web-firebase-b3e90.appspot.com",
        };
        firebase.initializeApp(config);
        return firebase;
      },

    }
  })
  .factory('LoginService', function($firebaseAuth, $ionicPopup){
    return {
      login: function(callback) {
        var auth = $firebaseAuth();
        auth.$signInWithPopup('google').then(callback)
          .catch(function(error) {
            $ionicPopup.alert({
              title: 'Message',
              template: 'Login Fail !'
            });
          })
      }

    }
  })
  .factory('Utils', function() {
    return {
      removeSpecialCharacter: function(str) {
        return str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      }
    }
  })
