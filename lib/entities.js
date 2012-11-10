//--- Box2D + Shortcuts ----

var Box2D = require('./box2d.js');
var b2World = Box2D.Dynamics.b2World,
  b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

module.exports = {

  //--- WORLD ---
  world: function() {
    var box2DWorld = new b2World(new b2Vec2(0, 0), true); // no gravity

    return {
      asteroids: [],
      missiles: [],
      players: [],
      box2DObj: box2DWorld
    };
  },

  //--- ASTEROID ---
  asteroid: function(world, x, y, radius) {
    // generate id
    id = world.asteroids.length + 1;

    // fixture
    var fixture = new b2FixtureDef;
    fixture.density = 100.0;
    fixture.friction = 1.0;
    fixture.restitution = 0.0; // asteroids shouldn't bounce...or should they?

    // shape
    fixture.shape = new b2CircleShape(radius);

    // body
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody; // asteroids don't move

    // TODO: DO SOME MATH TO CONVERT PIXEL TO BOX2D OBJ CENTER
    bodyDef.position.x = x; // CENTER X
    bodyDef.position.y = y; // CENTER Y

    return {
      id: id,
      life: 100,
      x: x, // top left coordinates
      y: y,
      radius: radius,
      bodyDef: bodyDef
    };
  }
};