'use strict';
require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const URL = require('url-parse');
const shortUrl = require('./models/url-model');

mongoose.Promise = global.Promise;

const app = express();

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
  var urlTester = /^(ftp|http|https):\/\/[^ "]+$/;
  var hostname = URL(url).hostname;
  

  if(url.match(urlTester)) {
    dns.lookup(hostname, (err) => {
      if(err) {
        res.json({"error":"invalid URL"});
      } else {
        shortUrl.findOne({'originalUrl': url}).then((item) => {
          if(item) {
            res.json({
              "originalUrl": item.originalUrl,
              "shortUrl": item.shortUrl
            });
          } else if(!item) {
            var data = new shortUrl({
              originalUrl: url,
              shortUrl: Math.floor(Math.random()*100000).toString()
            });
            data.save().then((doc) => {
              res.json({
                "originalUrl": doc.originalUrl,
                "shortUrl": doc.shortUrl
              });
            }, (e) => {
              res.status(400).send(e);
            });
          }
        }, (e) => {
          res.status(400).send(e);
        });
      }
    });
  } else {
    res.json({"error":"invalid URL"});
  }

});

//  Response to GET request for shortUrls
app.get('/api/shorturl/:url_id', (req, res) => {
  var shorterUrl = req.params.url_id;

  shortUrl.findOne({'shortUrl': shorterUrl}).then((item) => {
    res.redirect(item.originalUrl);
  }).catch((e) => {
    res.status(400).send();
  });
});



app.listen(port, () => {
  console.log('Node.js listening ...');
});