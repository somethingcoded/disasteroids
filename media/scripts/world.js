var missile = {
    life: 100,
    x: 0,
    y: 0,
    owner: 'Optimus Prime',
    movementVector: undefined,
    box2DObj: undefined
};

var asteroid = {
    life: 100,
    x: 0,
    y: 0,
    radius: 30,
    box2DObj: undefined
};

var player = {
  username: 'Optimus Prime',
  life: 100,
  x: 0,
  y: 0,
  box2DObj: undefined
};

var world = {
  missiles: [],
  asteroids: [],
  players: [],
  box2DObj: undefined
};
