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
    // shape
    // body
  }

  return {
    life: 100,
    x: x,
    y: y,
    radius: radius,
    box2DObj: undefined
  }
};

//--- WORLD ---

var world = {
  missiles: [],
  asteroids: [],
  players: [],
  box2DObj: undefined,
  currentPlayer: undefined
};
