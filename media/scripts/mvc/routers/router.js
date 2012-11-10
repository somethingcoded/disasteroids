(function() {
  'use strict';

  sc.routers.Router = Backbone.Router.extend({
    routes: {
      '': 'lobby',
      'world': 'world',
      'results': 'results'
    },

    lobby: function() {
      if (!window.app.world) {
        window.app.world = new sc.models.World();
        window.app.worldView = new sc.views.WorldView({model: window.app.world, el: $('.world')});
      }

      window.app.worldView.render();
    },

    world: function() {
      if (!window.app.world) {
        window.app.world = new sc.models.World();
        window.app.worldView = new sc.views.WorldView({model: window.app.world, el: $('.world')});
      }

      window.app.worldView.render();
    },

    results: function() {
      if (!window.app.world) {
        window.app.world = new sc.models.World();
        window.app.worldView = new sc.views.WorldView({model: window.app.world, el: $('.world')});
      }

      window.app.worldView.render();
    }
  });
  
})();
