var Box2D = require('./box2d.js'),
  _ = require('underscore');

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
var box2DFPS = 60;

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
    safeJSON.box2DObj = undefined;
    return safeJSON;
  };
  self.addAsteroids = function() {
    // TODO: make this dynamic and random
    a1 = new asteroid(self, 10, 10, 5);
    a2 = new asteroid(self, 30, 30, 10);
    a3 = new asteroid(self, 50, 20, 8);
    a4 = new asteroid(self, 100, 100, 80);
    a5 = new asteroid(self, 200, 200, 30);
    self.asteroids = [a1, a2, a3, a4, a5];
  };
};

var asteroid = function(world, x, y, radius) {
  //TODO add id hurr
  var self = this;
  self.life = 100;
  self.x = x;
  self.y = y;
  self.radius = radius;

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

  self.body = world.box2DObj.CreateBody(bodyDef);
  self.fixture = self.body.CreateFixture(fixture);

  self.toJSON = function() {
    var safeJSON = _.clone(self);
    safeJSON.body = undefined;
    safeJSON.fixture = undefined;
    return safeJSON;
  };
};

var player = function(world, id, username) {
  var self = this;
  self.username = username;
  self.id = id; // socket io id
  self.width = 80;
  self.height = 100;
  self.life = 100;
  self.x = 450;
  self.y = 450;
  self.angle = 0;

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

  self.body = world.box2DObj.CreateBody(bodyDef);
  self.fixture = self.body.CreateFixture(fixture);

  // TODO remove me
  var kick = new b2Vec2(-10, -10);
  self.body.ApplyImpulse(kick, self.body.GetWorldCenter());

  self.toJSON = function() {
    var safeJSON = _.clone(self);
    safeJSON.body = undefined;
    safeJSON.fixture = undefined;
    return safeJSON;
  };
};

module.exports = {
  world: world,
  asteroid: asteroid,
  player:player
};
