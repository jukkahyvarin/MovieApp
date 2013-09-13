var express = require('express');
var Client = require('node-rest-client').Client;

var app = express();
//var fs = require('fs');
xml2js = require('xml2js');



app.get('/', function(req, res) {
   
    res.redirect('index.html');
});

// rest method for getting areas
app.get('/movies/getareas', function (req, res) {
      
    client = new Client();
    client.get('http://www.finnkino.fi/xml/TheatreAreas/', function(data, response){
        var parser = new xml2js.Parser({explicitArray:false});
        parser.parseString(data, function(err, result) {
            res.json(result);
        });
    });
    
});

// rest method for getting schedule dates
app.get('/movies/getscheduledates/:area', function (req, res) {
 
    client = new Client();
    client.get('http://www.finnkino.fi/xml/ScheduleDates/?area=' + req.params.area, function(data, response){
        var parser = new xml2js.Parser({explicitArray:false});
        parser.parseString(data, function(err, result) {
            res.json(result);
        });
    });
});

// rest method for getting movies
app.get('/movies/getschedule/:area/:date', function (req, res) {
 
    client = new Client();
    client.get('http://www.finnkino.fi/xml/Schedule/?area=' + req.params.area + '&dt=' + req.params.date, function(data, response){
        var parser = new xml2js.Parser({explicitArray:false});
        parser.parseString(data, function(err, result) {
            res.json(result);
        });
    });
});

// rest method for getting movie information
app.get('/movies/getschedule/:area/:date/:id', function (req, res) {
 
    client = new Client();
    client.get('http://www.finnkino.fi/xml/Schedule/?area=' + req.params.area + '&dt=' + req.params.date + '&eventID=' + req.params.id, function(data, response){
        var parser = new xml2js.Parser({explicitArray:false});
        parser.parseString(data, function(err, result) {
            res.json(result);
        });
    });
});


app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());

  
    app.use(express.static(__dirname + '/app'));
   
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use(app.router);    
});

app.listen(8000);
