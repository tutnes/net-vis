"use strict";
//Boilerplate Webserver

var express = require('express');
var jsonfile = require('jsonfile');
var handlebars = require('handlebars');
var hbs = require('hbs');
var file = "json-files/netjson.json";
// Statics for the tables and sections being generated
var app = express();
app.use(express.static('public'));
//Sets up hbs (handlebars) as the view engine so that render can use this.
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
//Register partials from the partials folder
hbs.registerPartials(__dirname + '/views/partials');
var d;
try {
d = jsonfile.readFileSync(file);
}catch(e){
	console.log("Could not find the jsonfile: " + file);
	d = require('./testdata');
	}


app.get('/', function(req, res){
  	res.render('home');
});

app.get('/data', function(req, res){
	res.send(d)
})

//Basic error handling
// Basic 404 handler
app.use(function (req, res) {
  res.status(404).send('Not Found');
});

//Basic 500 error handling
app.use(function (err, req, res, next) {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

var server = app.listen(8080, function () {
		var port = server.address().port;
		console.log('App listening on port %s', port);
});