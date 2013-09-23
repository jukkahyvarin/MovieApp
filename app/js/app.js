'use strict';


var app = angular.module('myApp', ['ngRoute', 'ngAnimate']);

// enable cross domain calls
app.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);




// Declare app level module which depends on filters, and services
app.config(function($routeProvider) {
    $routeProvider
        .when('/haealue', {
            templateUrl: 'partials/areaSearch.html', controller: 'MapAreaCtrl'
        })
        .when('/valitsealue', {
            templateUrl:'partials/areaSelect.html', controller: 'AreaCtrl'
        })
        .when('/valitsealue/e/:notfound', {
            templateUrl: 'partials/areaSelect.html', controller: 'AreaCtrl'
        })
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
    	.otherwise({redirectTo: '/haealue'});
});


//Add this to have access to a global variable
app.run(function ($rootScope) {
    $rootScope.currentArea = {};
});