'use strict';


app.service('GMapsService', function ($http) {


    return {
        getAddress: function (latLng) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLng + '&sensor=true').then(function (data, status, headers, config) {
                return data.data;
            });
        }
    }

});