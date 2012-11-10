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

app.get('*', function(req, res, next) {
  res.render('layout.html');
});

server.listen(conf.port);

console.log('Server running at http://localhost:' + conf.port);

//--- Box2D Physics Simulation ---

var world = new entities.world();
world.addAsteroids();
var update = function() {
  for (var i=0; i < world.asteroids.length; i++) {
    var asteroidCenter = world.asteroids[i].body.GetWorldCenter();

    for (var j=0; j < world.players.length; j++) {
      var player = world.players[j];
      playerBox2DCenter = player.body.GetWorldCenter();

      // apply radial gravity
      var pToA = new Box2D.Common.Math.b2Vec2(0, 0);
      pToA.Add(asteroidCenter);
      pToA.Subtract(playerBox2DCenter);

      var force = world.asteroids[i].radius*80/(pToA.LengthSquared()/2);
      pToA.Normalize();
      pToA.Multiply(force);

      world.players[j].body.ApplyForce(pToA, asteroidCenter);
    }
  }
  world.box2DObj.Step(1/world.FPS, 10, 10);

  for (var j=0; j < world.players.length; j++) {

    // update players with new location and angle
    var player = world.players[j];
    playerBox2DCenter = player.body.GetWorldCenter();
    player.x = playerBox2DCenter.x * world.scale;
    player.y = playerBox2DCenter.y * world.scale;
    player.angle = player.body.GetAngle();
  }

  io.sockets.emit('sync', world);
  world.box2DObj.ClearForces();
};
setInterval(function() {
  update();
}, 1000/world.FPS);

//--- Message Handling ---

var io = sio.listen(server);

io.sockets.on('connection', function(socket) {
  io.sockets.emit('news', 'someone connected');
  socket.emit('sync', world);
  console.log('someone connected');

  // TODO REMOVE DEBUG PLAYER
  var newPlayer = new entities.player(world, 'testid', 'testname', 310, 400);
  world.players.push(newPlayer);

  socket.on('disconnect', function() {
    io.sockets.emit('news', 'someone disconnected');
    console.log('someone disconnected');
  });

  socket.on('login', function(data) {
    // username already taken
    for (var i=0; i < world.players.length; i++) {
      if (world.players[i].username == data.username) {
        socket.emit('loginError', 'That name is already taken :(');
        return;
      }
    }

    // create user and log in
    var newPlayer = new entities.player(world, socket.id, data.username);
    world.players.push(newPlayer);
    io.sockets.emit('news', data.username + ' logged in');
    socket.emit('loggedIn', {username: data.username});
  })
});
