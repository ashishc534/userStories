var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
//extended : true means, post request can also contain images, not just strings.
var urlEncodedParser = bodyParser.urlencoded({extended: true});
var config = require('./config.js');

mongoose.connect(config.database,function(err){
  if(err)
  throw err;

  console.log('Connected to database!');
});

app.listen(config.port);
console.log(`You are listening at port ${config.port}`);
