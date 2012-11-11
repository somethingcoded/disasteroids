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
      this.players.on('add', this.setCurrentPlayer);
      
      window.socket.on('missileDestroyed', this.missileDestroyed);
    },
    
    playersChanged: function(model, players) {
      // console.log('players changed');
      var self = this;
      // iterate through existing
      // oh god the horror
      self.players.each(function(p, i) {
        var found = false;
        _.each(players, function(p2, i2) {
          if ((p && p2) && (p.id === p2.id))
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

    setCurrentPlayer: function(player) {
      if (player.get('username') == app.username) {
        app.set({currentPlayer: player});
      }
    },

    asteroidsChanged: function(model, asteroids) {
      var self = this;
      // iterate through existing
      // oh god the horror
      self.asteroids.each(function(a, i) {
        var found = false;
        _.each(asteroids, function(a2, i2) {
          if ((a && a2) && (a.id === a2.id))
            found = true;
        });
        if (!found) {
          // this asteroid doesn't exist anymore brah
          self.asteroids.remove(a);
        }
      });
      // iterate through incoming
      _.each(asteroids, function(a, i) {
        var asteroid = self.asteroids.get(a.id);
        if (asteroid) {
          // update existing
          asteroid.set(a)
        } else {
          // make new
          self.asteroids.add(a);
        }
      });
    },

    missilesChanged: function(model, missiles) {
      var self = this;
      // iterate through existing
      // oh god the horror
      self.missiles.each(function(m, i) {
        var found = false;
        _.each(missiles, function(m2, i2) {
          if ((m && m2) && (m.id === m2.id))
            found = true;
        });
        if (!found) {
          // this missile doesn't exist anymore brah
          self.missiles.remove(m);
        }
      });
      // iterate through incoming
      _.each(missiles, function(m, i) {
        var missile = self.missiles.get(m.id);
        if (missile) {
          // update existing
          missile.set(m)
        } else {
          // make new
          self.missiles.add(m);
        }
      });
    },

    missileDestroyed: function(data) {
      if (data.playerID == app.currentPlayer.id) {
        app.currentPlayer.missileDestroyed();
      }
    },

    parse: function(attrs) {
      this.set({players: attrs.players || []});
      this.set({asteroids: attrs.asteroids || []});
      this.set({missiles: attrs.missiles || []});
    }
  });
  
})();
