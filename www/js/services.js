angular.module('EDDStats.services', [])

.factory('Data', function($q, $http, $state) {
	return {
		fetch: function() {
			console.log('get from remote');
			var defer = $q.defer()
			$http.get('http://dev/ipsthemes2/wordpress/edd-api/stats/?key=84008b8751a97fec3a3ad2e2ba2ad97c&token=1cef39ce826e5dcbf10a08b78843b8eb&type=earnings').
				success(function(data, status, headers, config) {
					defer.resolve(data);
				}).
				error(function(data, status, headers, config) {
					console.log('error!');
					defer.reject();
				});
			return defer.promise
		},

		get: function() {
			var deferred = $q.defer(), self = this;

			localforage.getItem('EDDStats_data').then(function(data) {
				if(!!data) {
					console.log('has data?');
					deferred.resolve(data);
				} else {
					// has no data!!
					deferred.reject();
				}
			});

			return deferred.promise;
		},

		store: function(data) {
			var defer = $q.defer();

			console.log('storing data: ',data);

			localforage.setItem('EDDStats_data',data).then(function() {
				defer.resolve();
			});

			return defer.promise;
		},

		reset: function() {
			localforage.removeItem('EDDStats_data', function(err) {
			    console.warn('DB Cleared');
				$state.go('home');
			});
		}
	}
});