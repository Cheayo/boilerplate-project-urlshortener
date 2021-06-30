require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

var urllist = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use('/api/shorturl', bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:urlkey', function(req, res) {
  if (isNaN(req.params.urlkey) || parseInt(req.params.urlkey) >= urllist.length) {
    res.json({error: "Shortened URL does not exist."});
  } else {
    res.redirect(urllist[req.params.urlkey]);
  }
});

app.post('/api/shorturl', function(req, res) {
  let urlSplit = req.body.url.toLowerCase().split('/');

  if (urlSplit.length >= 3) {
    let hostname = urlSplit[2];
    
    dns.lookup(hostname, function(err, address, family) {
      if(err) {
        res.json({error: 'invalid url'});
      } else {
        let shorturl = (urllist.push(req.body.url)) - 1;

        res.json({original_url: req.body.url, short_url: shorturl});
      }
    });
  } else {
    res.json({error: 'invalid url'});
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
