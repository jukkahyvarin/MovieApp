'use strict';


app.controller('NavCtrl', function ($scope, $location, $routeParams, moviesService, GMapsService) {
	
   moviesService.getAreas().then(function (data) {
        var firstArea = data.TheatreAreas.TheatreArea[1];
        $scope.areas = data.TheatreAreas.TheatreArea;
        if ($routeParams.areaId) {
            var selArea;
            angular.forEach($scope.areas, function (a, key) {
                if (a.ID == $routeParams.areaId) {
                    selArea = a;
                }
            });
            $scope.selectedarea = selArea;
        }
        else {
            $scope.selectedarea = $scope.areas[0];
        }
    });



    $scope.areaselected = function (a) {
        $scope.selectedarea = a;
    }

    $scope.date = $routeParams.date ? $routeParams.date : new Date();

    $scope.selectDate = function (d) {
        $scope.date = d;
    }

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
    moviesService.getSchedule($routeParams.areaId, schedDate).then(function (data) {
        var movies = $filter('filter')(data.Schedule.Shows.Show, $scope.timeFilter);
        $scope.movies = movies;
        getTypes();
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