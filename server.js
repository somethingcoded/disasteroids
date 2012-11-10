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

      // remove player if marked for delete
      var player = world.players[j];
      if (player.disconnected) {
        world.players.remove(j);
        continue;
      }

      // apply radial gravity
      playerBox2DCenter = player.body.GetWorldCenter();
      var pToA = new Box2D.Common.Math.b2Vec2(0, 0);
      pToA.Add(asteroidCenter);
      pToA.Subtract(playerBox2DCenter);
      var force = world.asteroids[i].radius*80/(pToA.LengthSquared()/2);
      pToA.Normalize();
      pToA.Multiply(force);
      world.players[j].body.ApplyForce(pToA, asteroidCenter);

      // apply radial gravity to missiles
      if (player.missile) {
        missileBox2DCenter = player.missile.body.GetWorldCenter();
        var mToA = new Box2D.Common.Math.b2Vec2(0, 0);
        mToA.Add(asteroidCenter);
        mToA.Subtract(missileBox2DCenter);
        var force = world.asteroids[i].radius*80/(mToA.LengthSquared()/2);
        mToA.Normalize();
        mToA.Multiply(force);
        player.missile.body.ApplyForce(mToA, asteroidCenter);
      }
    }
  }

  // simulate a step of the world
  world.box2DObj.Step(1/world.FPS, 10, 10);

  // update all objects with latest simulation changes
  for (var j=0; j < world.players.length; j++) {

    // update players
    var player = world.players[j];
    var playerBox2DCenter = player.body.GetWorldCenter();
    player.x = playerBox2DCenter.x * world.scale;
    player.y = playerBox2DCenter.y * world.scale;
    player.angle = player.body.GetAngle();

    // update player's missile if available
    if (player.missile) {
      var missile = player.missile;
      var missileBox2DCenter =  missile.body.GetWorldCenter();
      missile.x = missileBox2DCenter.x * world.scale;
      missile.y = missileBox2DCenter.y * world.scale;
      missile.angle = missile.body.GetAngle();
    }
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
    players[newPlayer.id] = newPlayer;
    io.sockets.emit('news', data.username + ' logged in');
    socket.emit('loggedIn', {username: data.username});
    console.log(newPlayer.id + ' - ' + newPlayer.username + ' logged in');
  });

  socket.on('chat', function(data) {
    socket.broadcast.emit('chat', data);
  });

  socket.on('shootMissile', function(data) {
    // find the player
    var missileOwner = players[data.playerID];
    if (missileOwner) {
      var newMissile = new entities.missile(world, missileOwner, data.x, data.y, data.vel);
      missileOwner.missile = newMissile;
      world.missiles.push(missileOwner);
    }
  });
});
