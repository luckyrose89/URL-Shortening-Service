'use strict';
require('dotenv').config();
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');
var bodyParser = require('body-parser');
var dns = require('dns');
var URL = require('url-parse');

mongoose.Promise = global.Promise;

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
var mongoURL = process.env.MONGOLAB_URI;
mongoose.connect(mongoURL,{
  useMongoClient: true
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) =>{
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});

// Response to post request
app.post('/api/shorturl/new', (req, res) => {
  var url = req.body.url;
  var urlTester = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

  if(url.match(urlTester)) {
    var hostname = URL(url).hostname;
    dns.lookup(hostname, (err, address, family) => {
      if(err) {
        res.json({"error":"invalid URL"});
      } else {
        res.json({url});
      }
    });
  } else {
    res.json({"error":"invalid URL"});
  }

});


app.listen(port, () => {
  console.log('Node.js listening ...');
});