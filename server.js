var http = require('http'),
    conf = require('./conf.js'),
    express = require('express'),
    _ = require('underscore'),
    box2d = require('box2d');

var app = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/templates/');
  app.engine('html', require('ejs').renderFile);
  app.use(express.errorHandler());
  app.use('/media', express.static(__dirname + '/media'));
  app.use('/', express.static(__dirname + '/templates/'))
});

app.get('/', function(req, res, next) {
  res.render('layout.html', function(err, html) {
  
  });
});

app.listen(conf.port);
    
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(8000);

console.log('Server running at http://0.0.0.0:' + conf.port);
