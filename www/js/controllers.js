angular.module('EDDStats.controllers', [])

.controller('MainCtrl', function($scope, $state, Data) {

	$scope.EDDStats = {};

	$scope.reset = function() {
		Data.reset();
	}

})

.controller('HomeCtrl', function($scope, $state, Data) {
	$state.go('signup');
})

.controller('DashCtrl', function($scope, $state, $ionicHistory, Data) {
	$ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });

	Data.get().then(function(data) {		
		if(data) {
            $scope.EDDStats.data = angular.fromJson(data);
		}
	});
})


.controller('SignupCtrl', function($scope, $state, Data, $ionicHistory, $q) {

	$ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });

	Data.get().then(function(data) {
		console.log('already got data, skip signup', data);

		if(data) {
			return $state.go('dashboard');
		}
	});

	$scope.processForm = function() {
		console.log('form submit');

		Data.fetch().then(function(data) {
			Data.store(data).then(function() {
				$ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
				$scope.EDDStats.data = angular.fromJson(data);
				$state.go('dashboard');
			});		
		});		
	}
})


