#!/usr/bin/env node

var http = require('http');
var express = require('express');
var exec = require('child_process').exec;
var querystring = require("querystring");
var app = require('express')();
var server = require('http').createServer(app);
var sql = require('mssql'); // MS Sql Server client

// Connection string parameters.
var sqlConfig = {
    user: 'root',
    password: 'Gdhfixrez42!',
    server: 'localhost',
    database: 'exampledb',
	"options": {
	"enableArithAbort": true
    },
}


server.listen(8081);
console.log('Server listening on Port:8081');
app.use(express['static'](__dirname ));

/*
app.get('/scripts/online', function(req, res, next) {
  var child = exec('bash /home/pi/working/myapp/scripts/online/onlinestatus.sh', function(err, stdout, stderr) {
      res.setHeader('Content-Type', 'application/json');
      if(err) return next(err);
      else res.status(200).send(JSON.stringify(stdout));
      console.log(stdout);
  });
});
*/

app.get('/showacts', function (req, res) {
    sql.connect(sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from showacts', function(err, recordset) {
            if(err) console.log(err);
            res.end(JSON.stringify(recordset)); // Result in JSON format
        });
    });
})

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});
