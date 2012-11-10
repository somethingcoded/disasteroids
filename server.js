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

//--- Extend Array Obj ---

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//--- User Management ---

players = {}; // hash of id to user objects (logged in)

//--- Box2D Physics Simulation ---

var world = new entities.world();
world.addAsteroids();
var update = function() {
  for (var i=0; i < world.asteroids.length; i++) {
    var asteroidCenter = world.asteroids[i].body.GetWorldCenter();

    for (var j=0; j < world.players.length; j++) {
      var player = world.players[j];
      if (player.disconnected) { // remove player if marked for delete
        world.players.remove(j);
        continue;
      }

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
//io.set('log level', 1);

io.sockets.on('connection', function(socket) {
  io.sockets.emit('news', 'someone connected');
  socket.emit('sync', world);
  console.log('someone connected');

  socket.on('disconnect', function() {
    io.sockets.emit('news', 'someone disconnected');
    var dcName = socket.id;

    // remove user from node player list
    if (players[socket.id]) {
      delete players[socket.id];
    }

    // remove user from world player list
    for (var i=0; i < world.players.length; i++) {
      if (world.players[i].id == socket.id) {
        dcName = world.players[i].id + ' - ' + world.players[i].username;
        world.players[i].disconnected = true; // mark for deletion in world update
        break;
      }
    }

    // show dc for socket id or username if was logged in
    console.log(dcName + ' disconnected');
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
    var newPlayer = new entities.player(world, socket.id, data.username, 250, 800);
    world.players.push(newPlayer);
    io.sockets.emit('news', data.username + ' logged in');
    socket.emit('loggedIn', {username: data.username});
  });

  socket.on('chat', function(data) {
    socket.broadcast.emit('chat', data);
  });

  socket.on('shootMissile', function(data) {
    // find the player
    var missileOwner = data.player.id;
  });
});
