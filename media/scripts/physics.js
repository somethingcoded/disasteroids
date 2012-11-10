/*
 * All physics simulation of the world in Box2D is setup and done here
 */

//--- Box2D Shortcuts ---

var b2World = Box2D.Dynamics.b2World;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

//--- Box2D World Definitions ---

var box2DScale = 30; // 30 units = 1 box2D meter
var box2DFPS = 60;

//--- Physics Step Function ---

var updateWorld = function(updateCallback) {
  world.box2DObj.Step(1/box2DFPS, 10, 10);
  world.box2DObj.DrawDebugData();
  world.box2DObj.ClearForces();

  // updateCallback should be requestAnimFrame on the client and just a
  // dummy function on the server side */
  updateCallback(updateWorld);
}
