(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      this.players = new sc.collections.Players();
      this.asteroids = new sc.collections.Asteroids();
      this.missiles = new sc.collections.Missiles();
      this.on('change:players', this.playersChanged);
      this.on('change:asteroids', this.asteroidsChanged);
      this.on('change:missiles', this.missilesChanged);
    },
    
    playersChanged: function(model, players) {
      console.log('players changed');
      var self = this;
      // iterate through existing
      // oh god the horror
      self.players.each(function(p, i) {
        var found = false;
        _.each(players, function(p2, i2) {
          if (p.id === p2.id)
            found = true;
        });
        if (!found) {
          // this player doesn't exist anymore brah
          self.players.remove(p);
        }
      });
      // iterate through incoming
      _.each(players, function(p, i) {
        var player = self.players.get(p.id);
        if (player) {
          // update existing
          player.set(p)
        } else {
          // make new
          self.players.add(p);
        }
      });

    },

    asteroidsChanged: function(model, asteroids) {
      console.log('asteroids changed', asteroids);
      var self = this;
      // Update individual asteroids
      _.each(asteroids, function(a, i) {
        // TODO: check for existing objects
        console.log(a);
        self.asteroids.add(a); 
      });
    },

    missilesChanged: function(model, missiles) {
      console.log('missiles changed', missiles);
      var self = this;
      _.each(missiles, function(m, i) {
        var missile = self.missiles.get(m.id);
        if (missile) {
          missile.set(m); 
        } else {
          self.missiles.add(m);
        }
      });
    },

    parse: function(attrs) {
      this.set({players: attrs.players || []});
      this.set({asteroids: attrs.asteroids || []});
      this.set({missiles: attrs.missiles || []});
    }
  });
  
})();
