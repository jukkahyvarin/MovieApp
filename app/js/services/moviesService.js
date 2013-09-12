'use strict';


app.service('moviesService', function ($http) {

   
    return {
        getAreas: function () {
            //return $http.get('http://localhost:49871/api/movies/getareas').then(function (data, status, headers, config) {
            return $http.get('http://mynodeservice.azurewebsites.net/movies/getareas').then(function (data, status, headers, config) {
                return data.data;
            });
        },
        getSchedule: function (area, date) {
            return $http.get('http://mynodeservice.azurewebsites.net/movies/getschedule/' + area + '/' + date).then(function (data, status, headers, config) {
                return data.data;
            });
        },
        getScheduleDates: function (area) {
            return $http.get('http://mynodeservice.azurewebsites.net/movies/getscheduledates/' + area).then(function (data, status, headers, config) {
                return data.data;
            });
        },
        getMovie: function (area, id, date) {
            return $http.get('http://mynodeservice.azurewebsites.net/movies/getschedule/' + area + '/' + date + '/' + id).then(function (data, status, headers, config) {
                return data.data;
            });
        }

    }
   
		
});