'use strict';


var app = angular.module('myApp', ['ngRoute']);

// enable cross domain calls
app.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// Declare app level module which depends on filters, and services
app.config(function($routeProvider) {
    $routeProvider
    	.when('/leffat/alue/:areaId',
    	 {
    	 	templateUrl: 'partials/movies.html', controller: 'MoviesCtrl'
    	 })
        .when('/leffat/:areaId/:date',
    	 {
    	     templateUrl: 'partials/movies.html', controller: 'MoviesCtrl'
    	 })
         .when('/leffat/:areaId/:date/:time',
    	 {
    	     templateUrl: 'partials/movies.html', controller: 'MoviesCtrl'
    	 })
    	 .when('/leffa/:areaId/:movieId/:date',
    	 {
    	     templateUrl: 'partials/movieInfo.html', controller: 'MovieInfoCtrl'
    	 })
    	.otherwise({redirectTo: '/leffat/alue/1014'});
});

app.config(['$provide', function ($provide) {
    $provide.decorator("$browser", ['$delegate', function ($browser) {
        var _url = $browser.url;
        $browser.url = function () {
            var res = _url.apply(this, arguments);
            if (arguments.length === 0) {
                res = res.replace(/%23/g, '#');
            }
            return res;
        };
        return $browser;
    }]);
}]);
