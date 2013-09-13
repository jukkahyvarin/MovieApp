var express = require('express');

var app = express();

app.get('/', function(req, res) {
    //res.redirect('/dev.html');
    res.redirect('app/index.html');
});

app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());

    // TODO:
    //  * Add configuration loading
    //app.use(express.static('../exakti-client-web/app'));

    // app.use(express.static('../exakti-client-web/release'));
    // app.use(express.static('../exakti-client-web/release/img'));

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use(app.router);    
});

app.listen(8001);
