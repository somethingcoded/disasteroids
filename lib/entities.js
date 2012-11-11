var Box2D = require('./box2d.js'),
  _ = require('underscore'),
  uuid = require('node-uuid');

//--- Box2D + Shortcuts ----

var b2World = Box2D.Dynamics.b2World,
  b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var box2DScale = 30;
var box2DFPS = 30;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var world = function() {
  var box2DWorld = new b2World(new b2Vec2(0, 0), true); // no gravity
  var self = this;

  self.scale = box2DScale;
  self.FPS = box2DFPS;
  self.asteroids = [];
  self.missiles = [];
  self.players = [];
  self.box2DObj = box2DWorld;
  self.toJSON = function() {
    var safeJSON = _.clone(self);
    delete safeJSON.box2DObj;
    return safeJSON;
  };
  self.addAsteroids = function() {
    // ensures there is a minimum number of asteroids in the world
    // TODO: make this dynamic and random
    var minXOffset = 150;
    var minYOffset = 150;
    var maxX = 1200;
    var maxY = 900;
    var minAsteroidRadius = 30;
    var maxAsteroidRadius = 100;
    var sectionPadding = 180;
    var row = 0;
    var col = 0;
    var maxRow = Math.round((maxY - minYOffset*2)/(minYOffset+sectionPadding));
    var maxCol = Math.round((maxX - minXOffset*2)/(minXOffset+sectionPadding));

    for (var i=0; i < maxCol; i++) {
      for (var j=0; j < maxRow; j++) {
        var xMin = (minXOffset*(i+1)+(sectionPadding*i));
        var xMax = (minXOffset*(i+2)+(sectionPadding*i));
        var yMin = (minYOffset*(j+1)+(sectionPadding*j));
        var yMax = (minYOffset*(j+2)+(sectionPadding*j));
        var xPos = getRandomInt(xMin, xMax);
        var yPos = getRandomInt(yMin, yMax);
        var rad = getRandomInt(minAsteroidRadius, maxAsteroidRadius);
        newAsteroid = new asteroid(self, xPos, yPos, rad);
        self.asteroids.push(newAsteroid);
      }
    }
  };
};

var asteroid = function(world, x, y, radius) {
  var self = this;
  self.id = uuid.v4();
  self.type = 'asteroid';
  self.life = 100;
  self.x = x;
  self.y = y;
  self.radius = radius;
  self.playerCount = 0;

  // fixture
  var fixture = new b2FixtureDef;
  fixture.density = 100.0;
  fixture.friction = 1.0;
  fixture.restitution = 0.0; // asteroids don't bounce

  // shape
  fixture.shape = new b2CircleShape(radius/box2DScale);

  // body
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody; // asteroids don't move

  bodyDef.position.x = x/box2DScale; // CENTER X
  bodyDef.position.y = y/box2DScale; // CENTER Y

  bodyDef.userData = self;

  self.body = world.box2DObj.CreateBody(bodyDef);
  self.fixture = self.body.CreateFixture(fixture);

  self.toJSON = function() {
    var safeJSON = _.clone(self);
    delete safeJSON.body;
    delete safeJSON.userData;
    delete safeJSON.fixture;
    return safeJSON;
  };
};

var player = function(world, id, username) {
  var self = this;
  self.type = 'player';
  self.username = username;
  self.id = id; // socket io id
  self.width = 50;
  self.height = 66;
  self.life = 100;
  self.x = 0;
  self.y = 0;
  self.angle = 0;
  self.missile = undefined;
  self.nearestAsteroid;
  self.onAsteroid = false;
  self.socket = undefined;
  self.visible = false;

  // OMG STATS
  self.deaths = 0;
  self.kills = 0;
  self.hits = 0;
  self.misses = 0;
  self.suicides = 0;

  self.spawn = function() {
    var leastPopAsteroid = undefined;
    for (var i=0; i < world.asteroids.length; i++) {
      var asteroid = world.asteroids[i];

      // drop player on an uninhabitted asteroid if available
      if (asteroid.playerCount == 0) {
        leastPopAsteroid = asteroid;
        break;
      }
      if (leastPopAsteroid == undefined || leastPopAsteroid.playerCount > asteroid.playerCount) {
        // drop player on least populated asteroid if none empty
        leastPopAsteroid = asteroid;
      }
    }

    var asteroidCenter = leastPopAsteroid.body.GetWorldCenter();
    var randAngle = Math.random()*Math.PI*2;
    var offsetX = (leastPopAsteroid.radius/box2DScale+self.height/box2DScale/2)*Math.cos(randAngle);
    var offsetY = (leastPopAsteroid.radius/box2DScale+self.height/box2DScale/2)*Math.sin(randAngle);

    var playerPos = new b2Vec2(asteroidCenter.x + offsetX, asteroidCenter.y + offsetY);

    self.x = (asteroidCenter.x + offsetX)*box2DScale;
    self.y = (asteroidCenter.y + offsetY)*box2DScale;

    // set proper angle based on asteroid center
    self.body.SetAngle(randAngle+Math.PI/2);
    self.body.SetPosition(playerPos);
    self.angle = self.body.GetAngle();
    self.onAsteroid = true;
    self.visible = true;
    self.body.SetActive(true);
  };

  // fixture
  var fixture = new b2FixtureDef;
  fixture.density = 1.0;
  fixture.friction = 1.0;
  fixture.restitution = 0.2;

  // shape
  fixture.shape = new b2PolygonShape;
  fixture.shape.SetAsBox(self.width/box2DScale/2, self.height/box2DScale/2);

  // body
  var bodyDef = new b2BodyDef;
  self.bodyDef = bodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.userData = self;

  self.body = world.box2DObj.CreateBody(bodyDef);
  self.body.SetActive(false);
  self.fixture = self.body.CreateFixture(fixture);

  self.spawn();

  self.toJSON = function() {
    var safeJSON = _.clone(self);
    delete safeJSON.body;
    delete safeJSON.fixture;
    delete safeJSON.bodyDef;
    delete safeJSON.nearestAsteroid;
    delete safeJSON.userData;
    delete safeJSON.socket;
    return safeJSON;
  };
};

var missile = function(world, player, angle, power) {
  power = power || 1;
  var self = this;
  self.flightStart = new Date().getTime();
  self.maxFlightTime = 10000; // 10s before we kill a missile
  var theta1 = player.body.GetAngle();
  var theta2 = angle * Math.PI/180;
  var theta3 = theta1 + theta2 + Math.PI; // TODO
  var alpha = 2/100; // TODO
  var fireR = 60; //In pixels
  var playerCenter = player.body.GetWorldCenter();
  var playerX = playerCenter.x // Meters
  var playerY = playerCenter.y // Meters
  var fireDX = fireR*Math.cos(theta3) / world.scale; // Meters
  var fireDY = fireR*Math.sin(theta3) / world.scale; // Meters
  var fireX = fireDX + playerX;
  var fireY = fireDY + playerY;
  self.id = 'missile:' + player.id;
  self.type = 'missile';
  self.player = player;
  self.x = fireX * world.scale;
  self.y = fireY * world.scale;
  self.angle = theta3;
  //self.velocity = power;
  self.width = 8;
  self.height = 16;

  // fixture
  var fixture = new b2FixtureDef;
  fixture.density = 1.0;
  fixture.friction = 1.0;
  fixture.restitution = 0.2;

  // shape
  fixture.shape = new b2PolygonShape;
  fixture.shape.SetAsBox(self.width/box2DScale/2, self.height/box2DScale/2);

  // body
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;

  bodyDef.position.x = self.x/box2DScale; // TODO convert to top left??
  bodyDef.position.y = self.y/box2DScale;
  bodyDef.userData = self;

  self.body = world.box2DObj.CreateBody(bodyDef);
  self.fixture = self.body.CreateFixture(fixture);

  var kick = new b2Vec2(alpha*power*fireDX, alpha*power*fireDY);                                        
  var fireVec = new b2Vec2(fireX, fireY);
  self.body.ApplyImpulse(kick, fireVec);

  self.toJSON = function() {
    var safeJSON = _.clone(self);
    safeJSON.player = self.player.id;
    delete safeJSON.body;
    delete safeJSON.fixture;
    delete safeJSON.userData;
    return safeJSON;
  };
};

module.exports = {
  world: world,
  asteroid: asteroid,
  player:player,
  missile: missile
};
