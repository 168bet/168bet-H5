(function() {
    'use strict';

    var app = angular.module('app');

    app.controller('DashCtrl', ['$scope',
        function($scope) {

        }
    ]);

    app.controller('ChatsCtrl', function($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };
    });

    app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

        $scope.chat = Chats.get($stateParams.chatId);

        $scope.$on("$ionicView.beforeEnter",function(){//每次进入页面前判断是否登录
            console.log('i am here');
        });
    });

    app.controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
}());