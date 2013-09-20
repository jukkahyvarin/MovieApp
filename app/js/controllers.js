'use strict';



app.controller('MapAreaCtrl', function ($scope, $location, $routeParams, moviesService, GMapsService) {
    // *** Map initialization ***
    var radius = 0;
    $scope.selectedTheatre = {};
    $scope.selectedTheatreAddress = '';
    $scope.userLocation = 'Haetaan sijaintia';
    $scope.geocoding = true;
    var map;
    google.maps.visualRefresh = true;
    var mapOptions = {
        center: new google.maps.LatLng(66.29, 25.43),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var loc = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
         

            var marker = new google.maps.Marker({
                position: loc,
                map: map,
                title: 'Sijaintisi'
            });
            map.setCenter(loc);
            
            var latLng = position.coords.latitude.toString() + ',' + position.coords.longitude.toString();
            GMapsService.getAddress(latLng).then(function (data) {
                if(data.results[0]) {
                    $scope.userLocation = 'Sijaintisi: ' + data.results[0].formatted_address;
                    searchTheatre();
                }
            });

           

        }, function () {
            // handleNoGeolocation(true);
            $location.path('#/valitsealue');
        });
    } else {
        // Browser doesn't support Geolocation
        // handleNoGeolocation(false);
        $location.path('#/valitsealue');
    }


    function searchTheatre() {
        radius = radius + 1000;
        var request = {
            location: map.center,
            radius: radius,
            query: 'Finnkino',
            types: ['movie_theater']
        };

        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, searchCallback);
    }

    function searchCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // found theatres
            moviesService.getAreas().then(function (data) {
                var theatres = data.TheatreAreas.TheatreArea;
                var theatre;
                angular.forEach(theatres, function (t, k) {
                    var theatreName = results[0].name.replace('Finnkino','').trim();
                    if (t.Name.indexOf(theatreName,0)>-1) {
                        $scope.selectedTheatre = t;
                        $scope.selectedTheatreAddress = results[0].formatted_address;

                        var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: t.Name
                        });
                        map.setCenter(results[0].geometry.location);
                        $scope.geocoding = false;
                    }
                });
            });
        }
        else if (status == 'ZERO_RESULTS' && radius < 50000) {
            searchTheatre();
        }
        else {
            $scope.geocoding = false;
        }
    }

});



app.controller('AreaCtrl', function ($scope, $location, $routeParams, moviesService, GMapsService) {
    $scope.loadingAreas = true;
    moviesService.getAreas().then(function (data) {
        $scope.areas = data.TheatreAreas.TheatreArea;
        $scope.loadingAreas = false;
    });
});


app.controller('NavCtrl', function ($scope, $location, $routeParams, moviesService, GMapsService) {
	
   
    $scope.date = $routeParams.date ? $routeParams.date : new Date();

   
    moviesService.getScheduleDates($routeParams.areaId).then(function (data) {
        $scope.dates = data.Dates.dateTime;
        $scope.date = !$routeParams.date ? $scope.dates[0] : $routeParams.date;
    });

    $scope.times = [
       { t: '08:00' },
       { t: '09:00' },
       { t: '10:00' },
       { t: '11:00' },
       { t: '12:00' },
       { t: '13:00' },
       { t: '14:00' },
       { t: '15:00' },
       { t: '16:00' },
       { t: '17:00' },
       { t: '18:00' },
       { t: '19:00' },
       { t: '20:00' },
       { t: '21:00' },
       { t: '22:00' },
       { t: '23:00' }
    ];

    setCurrentTime();

    function setCurrentTime() {
        var curTime = new Date();
        if ($routeParams.date) {
            var selDate = new Date($routeParams.date);
            if (selDate && selDate.getDate() != curTime.getDate()) {
                $scope.selectedTime = $scope.times[0];
                return;
            }
        }
        
        var hours = curTime.getHours().toString();
        var mytime = hours.length == 1 ? '0' + hours + ':00' : hours + ':00';

        angular.forEach($scope.times, function (v, k) {
            if (v.t == mytime) {
                $scope.selectedTime = v;
            }
        });

    }

    $scope.selectTime = function (t) {
        $scope.selectedTime = t;
    };

    //function getCity() {
    //    if (navigator.geolocation) {
    //        navigator.geolocation.getCurrentPosition(function (position) {
    //            var latLng = position.coords.latitude.toString() + ',' + position.coords.longitude.toString();
    //            GMapsService.getAddress(latLng).then(function (data) {
    //                var city;
    //                if (data && data.results) {
    //                    angular.forEach(data.results, function (r, k) {
    //                        if (r.types[0] == "administrative_area_level_3") {
    //                            angular.forEach(r.address_components, function (ac, k) {
    //                                if (ac.types[0] == "administrative_area_level_3") {
    //                                    city= ac.short_name;
    //                                }
    //                            });
    //                        }
    //                    });
    //                }
    //                $scope.currentCity = city;
    //            });
    //        });
    //        }
    //}
   
	//$scope.getClass = function (path) {
	//    if ($location.path().substr(0, path.length) == path) {
	//        return true;
	//    }
	//    else {
	//        return false;
	//    }
	//}
  
    // Try HTML5 geolocation

   

    //if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(function (position) {
    //        //var pos = new google.maps.LatLng(position.coords.latitude,
    //        //                                 position.coords.longitude);
    //        var latLng = position.coords.latitude.toString() + ',' + position.coords.longitude.toString();
    //        GMapsService.getAddress(latLng).then(function (data) {
    //            var city = data.results[0].;
    //        });

    //    }, function () {
    //        // handleNoGeolocation(true);
    //    });
    //} else {
    //    // Browser doesn't support Geolocation
    //    // handleNoGeolocation(false);
    //}
	

});



app.controller('MoviesCtrl', function ($scope, $routeParams, $filter, moviesService) {
    
    $scope.area = $routeParams.areaId;
    
    $scope.date = $routeParams.date ? $routeParams.date : new Date();
    $scope.selectedTime = $routeParams.time ? $routeParams.time : '08:00';
    
    var schedDate = $filter('date')($scope.date, 'dd.MM.yyyy');
    $scope.loadingMovies = true;

    moviesService.getSchedule($routeParams.areaId, schedDate).then(function (data) {
        var movies = $filter('filter')(data.Schedule.Shows.Show, $scope.timeFilter);
        $scope.movies = movies;
        getTypes();
        $scope.loadingMovies = false;
    });

    $scope.selectGenre = function (g) {
        $scope.selectedGenre = g;
    }

   
    $scope.timeFilter = function (item) {
        var dateStr = $scope.date.toString().replace('00:00:00', $scope.selectedTime + ':00');
        var filterDate = new Date(dateStr);
        var itemDate = new Date(item.dttmShowStart);
        var ret = itemDate >= filterDate;
        return ret;
    };

   
    $scope.genreFilter = function (item) {
        if (!$scope.selectedGenre) {
            return true;
        }
        return item.Genres.indexOf($scope.selectedGenre.name, 0) > -1;
    };

  

    function getTypes() {
        var genres = [];
        angular.forEach($scope.movies, function(m, k) {
            var items = m.Genres.split(',');
            for (var i = 0; i < items.length; i++) {
                var item = items[i].trim();
                if (genres.indexOf(item, 0) == -1) {
                    genres.push(item);
                }
            }
        });
        var gns = [];
        angular.forEach(genres, function (v, k) {
            var genre = { name: v, checked: false };
            gns.push(genre);
        });
        $scope.genres = gns;
    }
 
});

app.controller('MovieInfoCtrl', function ($scope, $routeParams, $filter, moviesService) {
    var schedDate = $filter('date')($routeParams.date, 'dd.MM.yyyy');
    var map;

    $scope.loadingMovies = true;
    moviesService.getMovie($routeParams.areaId, $routeParams.movieId, schedDate).then(function (data) {
        if ($.isArray(data.Schedule.Shows.Show)) {
            $scope.movie = data.Schedule.Shows.Show[0];
        }
        else {
            $scope.movie = data.Schedule.Shows.Show;
        }



        // *** Map initialization ***
        google.maps.visualRefresh = true;
        var mapOptions = {
            center: new google.maps.LatLng(66.29, 25.43),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

      
        var request = {
            location: map.center,
            radius: '500',
            query: 'Finnkino, ' + $scope.movie.Theatre
        };

        searchTheatre(request);
        $scope.loadingMovies = false;
    });

    function searchTheatre(request) {
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, searchCallback);
    }

    function searchCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var loc = new google.maps.LatLng(results[0].geometry.location.ob, results[0].geometry.location.pb);
            var marker = new google.maps.Marker({
                position: loc,
                map: map,
                title: results[0].name
            });
            map.setCenter(loc);

            var infoContent ='<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + results[0].name + '</h1>'+
                '<div id="bodyContent">' +
                '<p>' + results[0].formatted_address + '</p>' +
                '</div>' +
                '</div>';

            var iw = new google.maps.InfoWindow({
                content: infoContent
            });

            google.maps.event.addListener(marker, 'click', function () {
                iw.open(map, marker);
            });
        }
            
    }
});