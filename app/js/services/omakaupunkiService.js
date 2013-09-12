'use strict';


app.service('omakaupunkiService', function() {
	this.getCategories = function() {
		return categories;
	};

	this.getEvents = function() {
		return events;
	}

	var categories = [
		{ 
			id: 1,
			name: 'Elokuva'
		},
		{ 
			id: 2,
			name: 'Klubit'
		},
		{ 
			id: 3,
			name: 'Musiikki'
		}
	];

	var events = [
		{ id: 1, title: 'Soundgarden Hartwall areenalla',  url: '', start_time: '2013-09-04T21:00:00', end_time: '2013-09-04T23:00:00', lat: 64.03404, lon: 23.34453 },
		{ id: 2, title: 'Tomahawk Cirkuksessa', url: '', start_time: '2013-09-04T22:00:00', end_time: '2013-09-05T01:00:00', lat: 64.34404, lon: 23.22453 },
		{ id: 3, title: 'Kolmas hieno eventti', url: '', start_time: '2013-09-06T19:00:00', end_time: '2013-09-06T22:00:00', lat: 64.03404, lon: 23.34453 }
	];
});