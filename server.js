"use strict";
//Boilerplate Webserver

//Example URL http://klpcascph001v.klpcph.local/rest/dmiquery/getDMIData3?appId=CVENT&viewId=ClientView&dimensionIds=['cIP','sIP']&metricIds=['cByte','sByte']&resolution=1&dimFilters=[]&metricFilters=[]&sort=[]&top=1000&timePeriod=p&numberOfPeriods=1&dataSourceId=ALL_AGGR 


var express = require('express');
var jsonfile = require('jsonfile');
var handlebars = require('handlebars');
var hbs = require('hbs');
var file = "json-files/netjson.json";
var file2 = "json-files/example.json";
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
d = jsonfile.readFileSync(file2);
}catch(e){
	console.log("Could not find the jsonfile: " + file);
	d = require('./testdata');
	}

var output = {
	"type": "NetworkGraph",
    "label": "Ninux Roma",
    "protocol": "OLSR",
    "version": "0.6.6.2",
    "metric": "ETX",
    "nodes": [],
    "links": []
};


var cIP,sIP;//console.log(d.formattedData.length);
var tmp = {};
for (var i=0; i < d.formattedData.length; i++) {
//for (var i=0; i < 50; i++) { //d.formattedData.length; i++) {
	
	
	if (d.formattedData[i][0] != null && d.formattedData[i][1] != null) {
		
		cIP = d.formattedData[i][0];
		sIP = d.formattedData[i][1];
		
		if (tmp[sIP] == true)  {
			console.log(sIP + " exists");
		}
		else
		{
			
			output.nodes.push({id: sIP})
		}

		if (tmp[cIP] == true)  {
			console.log(cIP + " exists");
		}
		else
		{
			
			output.nodes.push({id: cIP})
		}
		tmp[cIP] = true;
		tmp[sIP] = true;
		//console.log(output.nodes.indexOf(cIP));
		
		
		
		
		output.links.push({source: cIP, target: sIP });
	}

}


function in_array(array, id) {
    for(var i=0;i<array.length;i++) {
        return (array[i][0].id === id)
    }
    return false;
}


console.log(tmp)

app.get('/', function(req, res){
  	res.render('home');
});

app.get('/data', function(req, res){
	res.send(output)
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