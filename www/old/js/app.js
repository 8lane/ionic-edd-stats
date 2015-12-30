// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('intro', {
		url: '/',
		templateUrl: 'templates/intro.html',
		controller: 'IntroCtrl'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: 'templates/settings.html',
		controller: 'SettingsCtrl'
	})
	.state('main', {
		url: '/main',
		templateUrl: 'templates/main.html',
		controller: 'MainCtrl'
	})
	.state('settings', {
		url: '/settings',
		templateUrl: 'templates/settings.html',
		controller: 'SettingsCtrl'
	});

	$urlRouterProvider.otherwise("/");

})

.controller('IntroCtrl', function($scope, $state, $ionicHistory) {

	$scope.hasData = false;

	$scope.startApp = function() {
		$state.go('main');
	}

	$scope.startSignup = function() {
		$state.go('signup');
	}

	$scope.init = function() {
		localforage.getItem('EDDStats_data').then(function(data) {
			if(!!data) {
				$scope.hasData = true;
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				return $scope.startApp();
			}

		});
	}

	$scope.init();
})

.controller('SettingsCtrl', ['$scope', '$state', '$http', '$timeout', '$q', '$ionicBackdrop','$ionicHistory', function($scope, $state, $http, $timeout, $q, $ionicBackdrop,$ionicHistory) {

	$scope.master = {};
	$scope.uiRouterState = $state;

	$scope.startApp = function() {
		console.log('GO GO GO START APP');
		$state.go('main');
	}

	$scope.setLoading = function(loading) {
		var defer = $q.defer()
		$scope.isLoading = loading;
		loading ? $ionicBackdrop.retain() : $ionicBackdrop.release();
		return defer.promise
	}

	$scope.showError = function(data) {
		console.warn('cant store cos of error:',data);
		$scope.setLoading(false);
	}

	$scope.getData = function() {
		var defer = $q.defer()
		$http.get('http://dev/ipsthemes2/wordpress/edd-api/stats/?key=84008b8751a97fec3a3ad2e2ba2ad97c&token=1cef39ce826e5dcbf10a08b78843b8eb&type=earnings').
			success(function(data, status, headers, config) {
				defer.resolve(data);
			}).
			error(function(data, status, headers, config) {
				$scope.showError(data,status);
				defer.reject();
			});
		return defer.promise
	}
    	
	$scope.storeData = function(data,settings) {
		var defer = $q.defer(),
			data = angular.extend(data, settings);

		console.log('test',data);

		localforage.setItem('EDDStats_data',data).then(function() {
			defer.resolve();
		});

		return defer.promise;
	}

	$scope.processForm = function(site) {
        $scope.master = angular.copy(site);

    	$scope.setLoading(true)
    		.then($scope.getData()
	    		.then(function(data) {
	    			var settings = $scope.master;
	    			$scope.storeData(data,settings)
	    				.then($scope.setLoading(false))
	    				.then($scope.startApp());
	    		})
    		);
	}

	$scope.init = function() {
		$scope.site = angular.copy($scope.master);

		localforage.getItem('EDDStats_data').then(function(data) {
			if(!!data) {
				$scope.$apply(function () {
					if(data.hasOwnProperty('url')) {
						$scope.site.url = data.url;
					}
					if(data.hasOwnProperty('key')) {
			            $scope.site.key = data.key;
					}
			 	});
			}

		});
	};

	$scope.init();

}])

.directive('myCustomer', function() {
	return {
		template: '<p class="item-icon-left">Loading stuff...<ion-spinner icon="ios"/></p>'
	};
})

.controller('MainCtrl', function($scope, $state, $q) {
	console.log('MainCtrl');

	$scope.uiRouterState = $state;
	$scope.EDD = false;

	$scope.startRefresh = function() {
		console.log('refresh!!');
	}

	$scope.startSettings = function() {
		$state.go('settings');
	}
	
	$scope.getData = function() {
		localforage.getItem('EDDStats_data').then(function(data) {
	        $scope.$apply(function () {
	            $scope.EDD = angular.fromJson(data);
				console.log('data:',$scope.EDD);
	        });
		});
	}

	$scope.getData();

})

.controller('EDD_header', function($scope, $http, $state) {
	$scope.uiRouterState = $state;

	console.log('state:',$scope.uiRouterState);



})

// app.factory('UtilService', function() {
// 	return {
// 		linkTo: function(link) {
// 			window.open(link, '_system');
// 		}
// 	}
// })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
