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

//-- html escape func ---

function htmlEscape(text) {
   return text.replace(/&/g, '&amp;').
     replace(/</g, '&lt;').
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
}

//--- User Management ---

players = {}; // hash of id to user objects (logged in)

//--- Box2D Physics Simulation ---

var world = new entities.world();
world.addAsteroids();

var contactListener = new Box2D.Dynamics.b2ContactListener;
//---- ON CONTACT ----
contactListener.BeginContact = function(contact) {
  var bodyAData = contact.GetFixtureA().GetBody().GetUserData();
  var bodyBData = contact.GetFixtureB().GetBody().GetUserData();

  var player = undefined;
  var target = undefined;
  var missile = undefined;

  // player to asteroid collision
  if (bodyAData.type == 'player') { player = bodyAData; target = bodyBData; }
  if (bodyBData.type == 'player') { player = bodyBData; target = bodyAData; }

  if (player && target.type == 'asteroid') {
    // snap to proper angle on asteroid
    //var playerCenter = player.body.GetWorldCenter();
    //var astCenter = target.body.GetWorldCenter();
    //var newAngle = Math.atan((playerCenter.y-astCenter.y)/(playerCenter.x-astCenter.x));
    //player.body.SetAngle(newAngle);
    player.onAsteroid = true;
    player.body.SetAwake(false);
    target.playerCount++;
  }

  // missile to player or asteroid
  if (bodyAData.type == 'missile') { missile = bodyAData; target = bodyBData; }
  if (bodyBData.type == 'missile') { missile = bodyBData; target = bodyAData; }

  if (missile && target) {
    missile.body.SetActive(false);
    if (target.type == 'asteroid') {
      missile.player.misses++;
      target.life -= 25;
      if (target.life < 0)
        target.life = 0;
    }
    else if (target.type == 'player') {
      target.life = 0;

      // dont credit derps hitting themselves
      if (target.id == missile.player.id) {
        missile.player.misses++;
        missile.player.suicides++;
      }
      else {
        missile.player.kills++;
        missile.player.hits++;
      }
    }
    else if (target.type == 'missile') {
      missile.player.misses++;
      target.life = 0;
    }
    missile.life = 0;
  }
}

//---- END CONTACT ---
contactListener.EndContact = function(contact) {
  var bodyAData = contact.GetFixtureA().GetBody().GetUserData();
  var bodyBData = contact.GetFixtureB().GetBody().GetUserData();

  var player = undefined;
  var target = undefined;
  if (bodyAData.type == 'player') { player = bodyAData; target = bodyBData; }
  if (bodyBData.type == 'player') { player = bodyBData; target = bodyAData; }

  if (player && target.type == 'asteroid') {
    player.onAsteroid = false;
    player.body.SetAwake(true);
    target.playerCount--;
  }
}
contactListener.PostSolve = function(contact, impulse) {
}
contactListener.PreSolve = function(contact, oldManifold) {
}
world.box2DObj.SetContactListener(contactListener);


//---- update ----
var update = function() {

  for (var i=0; i < world.asteroids.length; i++) {
    // WARNING: ASSUMES AT LEAST 1 ASTEROID EXISTS
    var asteroid = world.asteroids[i];

    if (asteroid.life == 0) {
      world.box2DObj.DestroyBody(asteroid.body);
      world.asteroids.remove(i);
      continue;
    }

    var asteroidCenter = asteroid.body.GetWorldCenter();

    // player update
    for (var j=0; j < world.players.length; j++) {
      var player = world.players[j];

      // remove player if marked for delete
      if (player.disconnected) {
        world.box2DObj.DestroyBody(player.body);
        world.players.remove(j);
        continue;
      }

      // player dead
      if (player.life == 0) {
        player.body.SetActive(false);
        player.life = 100;
        player.visible = false;
        player.deaths++;

        world.players.remove(j);
        // TODO SHOW LOL YOU DIED SCREEN
        world.players.push(player);
        player.spawn();
      }

      // nothing to step for player if on asteroid
      if (player.onAsteroid) {
        continue;
      }

      var playerCenter = player.body.GetWorldCenter();

      // player radial gravity
      var pToA = new Box2D.Common.Math.b2Vec2(0, 0);
      pToA.Add(asteroidCenter);
      pToA.Subtract(playerCenter);
      var force = asteroid.radius*80/(pToA.LengthSquared()/2);
      pToA.Normalize();
      pToA.Multiply(force);
      player.body.ApplyForce(pToA, asteroidCenter);

      // calc player orientation
      var minDistance = Infinity;
      var minVec;
      var distVec = new Box2D.Common.Math.b2Vec2(playerCenter.x-asteroidCenter.x, playerCenter.y-asteroidCenter.y);
      var dist = distVec.Length()-(asteroid.radius/world.scale)
      if (dist < minDistance) {
        minDistance = dist;
        minVec = distVec;
        player.nearestAsteroid = {minDistance: minDistance, minVec: minVec, distVec: distVec, asteroid: asteroid};
      }
    } // player loop

    for (var k=0; k < world.missiles.length; k++) {
      var missile = world.missiles[k];

      // remove missile if dead
      if (missile.life == 0) {
        world.box2DObj.DestroyBody(missile.body);
        missile.player.socket.emit('missileDestroyed', {'playerID': missile.player.id, 'missileID': missile.id});
        missile.player.missile = undefined;
        world.missiles.remove(k);
        continue;
      }

      // Set missle angle
      var currentVec = missile.body.GetLinearVelocity();
      var arctanArg = currentVec.y/currentVec.x
      missile.body.SetAngle((currentVec.x < 0 ? -1 : 1)*Math.PI/2 + Math.atan(arctanArg));  

      // apply radial gravity to missiles
      var missileBox2DCenter = missile.body.GetWorldCenter();
      var mToA = new Box2D.Common.Math.b2Vec2(0, 0);
      mToA.Add(asteroidCenter);
      mToA.Subtract(missileBox2DCenter);
      var force = world.asteroids[i].radius*1.3/(mToA.LengthSquared()/2);
      mToA.Normalize();
      mToA.Multiply(force);
      missile.body.ApplyForce(mToA, asteroidCenter);
    } // missile loop
  } // asteroid loop

  // apply player orientation
  for (var l=0; l < world.players.length; l++) {
    var player = world.players[l];
    if (!player.nearestAsteroid || player.life == 0 || player.onAsteroid) {
      continue;
    }
    var asteroidData = player.nearestAsteroid;
    var cutoff = asteroidData.asteroid.radius/world.scale * 2;
    if (asteroidData.minDistance < cutoff) {
      // gogogo start turning
      var ratio = asteroidData.minDistance/cutoff;
      var targetAngle = Math.atan(asteroidData.minVec.y/asteroidData.minVec.x);
      var currentAngle = player.body.GetAngle();
      player.body.SetAngle(ratio*currentAngle + (1-ratio)*(targetAngle + (asteroidData.minVec.x < 0 ? -1 : 1)*Math.PI/2));
    }
  } // orientation loop

  // step the world brah
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

app.configure('production', function() {
  io.set('log level', 1);
});
io.set('log level', 1);

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
    var newPlayer = new entities.player(world, socket.id, data.username);
    newPlayer.socket = socket;
    world.players.push(newPlayer);
    players[newPlayer.id] = newPlayer;
    io.sockets.emit('news', data.username + ' logged in');
    socket.emit('loggedIn', {username: data.username});
    console.log(newPlayer.id + ' - ' + newPlayer.username + ' logged in');
  });

  socket.on('chat', function(data) {
    data.msg = htmlEscape(data.msg);
    socket.broadcast.emit('chat', data);
  });

  socket.on('shootMissile', function(data) {
    var missileOwner = players[data.id];
    if (missileOwner.missile == undefined) {
      // find the player
      if (missileOwner) {
        var newMissile = new entities.missile(world, missileOwner, data.shotAngle, data.power);
        missileOwner.missile = newMissile;
        world.missiles.push(newMissile);
      }
    }
  });

  socket.on('moveCC', function() {
    console.log('moveCC');
  });

  socket.on('moveCCW', function() {
    console.log('moveCCW');
  });

  socket.on('jump', function() {
    console.log('jump');
  });

  socket.on('endMove', function() {
    console.log('endMove');
  });
});
