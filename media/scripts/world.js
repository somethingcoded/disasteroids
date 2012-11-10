//--- PLAYER ---

var player = {
  id: ''.
  username: 'Optimus Prime',
  life: 100,
  x: 0,
  y: 0,
  box2DObj: undefined
};

//--- MISSILE ---

var missile = function(x, y, owner, enablePhysics) {

  var box2DObj = undefined;
  var movementVector = undefined;
  if (enablePhysics) {
    // fixture
    // shape
    // body
  }

  return {
    x: x,
    y: y,
    owner: owner,
    movementVector: movementVector,
    box2DObj: box2DObj
  };
};

//--- ASTEROID ---

var asteroid = function(x, y, radius, enablePhysics) {

  var box2DObj = undefined;
  if (enablePhysics) {

    // fixture
    var fixture = new b2FixtureDef;
    fixture.density = 100.0;
    fixture.friction = 1.0;
    fixture.restitution = 0.0; // asteroids shouldn't bounce...or should they?

    // shape
    fixture.shape = new b2CircleShape(self.radius);

    // body
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody; // asteroids don't move

    // TODO: DO SOME MATH TO CONVERT PIXEL TO BOX2D OBJ CENTER
    bodyDef.position.x = x; // CENTER X
    bodyDef.position.y = y; // CENTER Y
  }

  return {
    life: 100,
    x: x, // top left coordinates
    y: y,
    radius: radius,
    box2DObj: box2DObj
  }
};

//--- WORLD ---

var world = function(enablePhysics, drawDebug) {
  var box2DWorld = undefined;

  if (enablePhysics) {
    var box2DWorld = new b2World(new b2Vec2(0, 0), true); // no gravity

    if (drawDebug) {
      var debugDraw = new b2DebugDraw;
      debugDraw.SetDrawScale(box2DScale);
      debugDraw.SetSprite(canvasContext); // NEED THIS DEFINED
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      box2DWorld.SetDebugDraw(debugDraw);
    }
  }

  return {
    missiles: [],
    asteroids: [],
    players: [],
    box2DObj: box2DWorld,
    currentPlayer: undefined,
  };
};
