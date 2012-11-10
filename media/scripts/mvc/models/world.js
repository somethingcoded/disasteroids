(function() {
  'use strict';

  sc.models.World = Backbone.Model.extend({
    initialize: function() {
      
    },

    parse: function(attrs) {
      this.set({players: attrs.players || []});
      this.set({asteroids: attrs.asteroids || []});
      this.set({missiles: attrs.missiles || []});
    }
  });
  
})();
