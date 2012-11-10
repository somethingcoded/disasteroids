(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      
    },

    start: function(attrs) {

      Backbone.history.start();
      
      this.currentPlayer = attrs.currentPlayer || undefined;
      this.players = new sc.collections.Players(attrs.players || []);
      this.asteroids = new sc.collections.Asteroids(attrs.asteroids || []);
    }
  });
  
})();
