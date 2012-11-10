(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      this.asteroids = new sc.collections.Asteroids();
      this.on('change:asteroids', this.asteroidsChanged);
    },
    
    asteroidsChanged: function(model, asteroids) {
      console.log('asteroids changed', asteroids);
      var self = this;
      // Update individual asteroids
      _.each(asteroids, function(e, i) {
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
