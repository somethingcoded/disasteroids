(function() {
  'use strict';
  
  // shim for request anim frame 
  window.requestAnimFrame = window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })(); 

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g
  }
  
  window.sc = {
    models: {},
    views: {},
    collections: {},
    routers: {}
  }
})();
