(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      this.players = new sc.collections.Players();
      this.asteroids = new sc.collections.Asteroids();
      this.on('change:players', this.playersChanged);
      this.on('change:asteroids', this.asteroidsChanged);
    },
    
    playersChanged: function(model, players) {
      console.log('players changed', players);
      var self = this;
      _.each(players, function(e, i) {
        // TODO: check for existing objects
        console.log(e);
        self.players.add(e);
      });

    },

    asteroidsChanged: function(model, asteroids) {
      console.log('asteroids changed', asteroids);
      var self = this;
      // Update individual asteroids
      _.each(asteroids, function(e, i) {
        // TODO: check for existing objects
        console.log(e);
        self.asteroids.add(e); 
      });
    },

    parse: function(attrs) {
      this.set({players: attrs.players || []});
      this.set({asteroids: attrs.asteroids || []});
      this.set({missiles: attrs.missiles || []});
    }
  });
  
})();
