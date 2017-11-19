(function() {
    'use strict';

    var app = angular.module('app');

    // app.run(['$ionicPlatform',
    //     function($ionicPlatform) {
    //         $ionicPlatform.ready(function() {
    //             // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //             // for form inputs)
    //             if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    //                 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //                 cordova.plugins.Keyboard.disableScroll(true);
    //
    //             }
    //             if (window.StatusBar) {
    //                 // org.apache.cordova.statusbar required
    //                 StatusBar.styleDefault();
    //             }
    //         });
    //     }
    // ]);

    app.run(['$rootScope', '$log',
        function($rootScope, $log) {
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                $log.debug('successfully changed states') ;

                $log.debug('event', event);
                $log.debug('toState', toState);
                $log.debug('toParams', toParams);
                $log.debug('fromState', fromState);
                $log.debug('fromParams', fromParams);
            });
        }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in app.controllers.js
            $stateProvider

                // setup an abstract state for the tabs directive
                .state('main', {
                    url: '/main',
                    abstract: true,
                    views: {
                        'main': {
                            templateUrl: 'views/tabs.html'
                        }
                    }
                })

                // Each tab has its own nav history stack:
                .state('main.home', {
                    url: '/home',
                    views: {
                        'tab-home': {
                            templateUrl: 'views/tab-dash.html',
                            controller: 'DashCtrl'
                        }
                    }
                })

                .state('main.gift', {
                    url: '/gift',
                    views: {
                        'tab-gift': {
                            templateUrl: 'views/tab-chats.html',
                            controller: 'ChatsCtrl'
                        }
                    }
                })
                .state('main.gift-detail', {
                    url: '/detail/:chatId',
                    views: {
                        'tab-gift': {
                            templateUrl: 'views/chat-detail.html',
                            controller: 'ChatDetailCtrl'
                        }
                    }
                })

                .state('main.account', {
                    url: '/account',
                    views: {
                        'tab-account': {
                            templateUrl: 'views/tab-account.html',
                            controller: 'AccountCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/main/home');
        }
    ]);
}());