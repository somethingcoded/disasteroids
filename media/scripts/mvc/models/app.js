(function() {
  'use strict';

  sc.models.App = Backbone.Model.extend({
    initialize: function() {
      
    },

    router: new sc.routers.Router,

    start: function() {
      var model = this;
      
      socket.on('sync', function(data) {
        model.currentPlayer = data.currentPlayer || undefined;
        model.world.parse(data);
      });
      
      Backbone.history.start({pushState: true});
    }
  });
  
})();