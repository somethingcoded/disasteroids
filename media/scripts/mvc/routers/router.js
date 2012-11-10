(function() {
  'use strict';

  sc.routers.Router = Backbone.Router.extend({
    routes: {
      '': 'lobby',
      'world': 'world',
      'results': 'results'
    },

    lobby: function() {
      window.worldView.render();
    },

    world: function() {
      window.worldView.render();
    },

    results: function() {
      window.worldView.render();
    }
  });
  
})();
