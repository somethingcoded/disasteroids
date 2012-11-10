(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      
    },

    router: new sc.routers.Router,

    start: function(attrs) {
      this.currentPlayer = attrs.currentPlayer || undefined;
      this.players = new sc.collections.Players(attrs.players || []);
      this.asteroids = new sc.collections.Asteroids(attrs.asteroids || []);

      Backbone.history.start({pushState: true});
    }
  });
  
})();
