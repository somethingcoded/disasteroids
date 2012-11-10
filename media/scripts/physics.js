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

var box2DFPS = 60;
var box2DWorld = new b2World(new b2Vec2(0, 0), true); // no gravity for us lolol

//--- Physics Step Function ---

var updateWorld = function() {
  //box2DWorld.Step(1/box2DFPS, 10, 10);
}
