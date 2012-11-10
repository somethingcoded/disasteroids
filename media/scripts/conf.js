(function() {
  'use strict';

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
