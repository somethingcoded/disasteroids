var http = require('http'),
    conf = require('./conf.js'),
    express = require('express'),
    _ = require('underscore'),
    sio = require('socket.io'),
    Box2D = require('./lib/box2d.js'),
    entities = require('./lib/entities.js');

var app = express();
var server = http.createServer(app);

app.configure(function() {
  app.set('views', __dirname + '/templates/');
  app.engine('html', require('ejs').renderFile);
  app.use(express.errorHandler());
  app.use('/media', express.static(__dirname + '/media'));
  // app.use('/', express.static(__dirname + '/templates/'))
  app.use(app.router);
});

app.get('/', function(req, res, next) {
  res.render('layout.html');
});

server.listen(conf.port);

console.log('Server running at http://localhost:' + conf.port);

//--- Box2D Physics Simulation ---

var world = new entities.world();
var update = function() {
  world.box2DObj.Step(1/world.box2DObj.FPS, 10, 10);
  world.box2DObj.ClearForces();
};
setInterval(function() {
  update();
}, 1000/world.box2DObj.FPS);

//--- Message Handling ---

var io = sio.listen(server);

io.sockets.on('connection', function(socket) {
  io.sockets.emit('news', 'someone connected');
  socket.emit('sync', world);
  console.log('someone connected');

  socket.on('disconnect', function() {
    io.sockets.emit('news', 'someone disconnected');
    console.log('someone disconnected');
  });

  socket.on('login', function(data) {
    console.log(data.username);
  })
});
