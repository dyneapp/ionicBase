'use strict';

angular.module('starter.services', [])

.service('Resource', ['$http', '$q', function ($http, $q) {
	var Resource = function(http, q, basePath) {
		var getPath = function (additionalPath, routeParameters) {
				var path = additionalPath ? basePath + '/' +  additionalPath : basePath;
				path = routeParameters ? replaceRouteParameters(routeParameters, path) : path;
				return path;
			},
			replaceRouteParameters = function(routeParameters, path) {
				angular.forEach(routeParameters, function(element, key){
					var regExp = new RegExp(':' + key);
					path = path.replace(regExp, element);
				});
				// remove unreplaced tokens
				path = path.replace(/\/:[^\/]*/gi,'');

				return path;
			},
			action = function(method, routeParameters, additionalPath, data, _config) {
				var deferred = q.defer(),
					config = _config || {};

				if(method === 'POST' || method === 'PUT') {
					if(typeof data === 'undefined') {
						deferred.reject({status: 'No data provided'});
						return deferred.promise;
					} else {
						config.data = data;
					}
				}

				config.method = method;
				config.url = getPath.call(this, additionalPath, routeParameters);
				config.withCredentials = true;
				config.headers = config.headers || {};

				http(config)
					.success(deferred.resolve)
					.error(deferred.reject);

				return deferred.promise;
			};

		this.get = function(additionalPath, routeParameters, config) {
			return action('GET', routeParameters, additionalPath, undefined, config);
		};

		this.post = function(additionalPath, routeParameters, data, config) {
			return action('POST', routeParameters, additionalPath, data, config);
		};

		this.put = function(additionalPath, routeParameters, data, config) {
			return action('PUT', routeParameters, additionalPath, data, config);
		};

		this.delete = function(additionalPath, routeParameters, config) {
			return action('DELETE', routeParameters, additionalPath, undefined, config);
		};

		this.sendResponse = function(response) {
			return response;
		};

		this.sendError = function(error) {
			error.error = true;
			return error;
		};
	};

	return function(basePath) {
		return new Resource($http, $q, basePath);
	};
}]);
