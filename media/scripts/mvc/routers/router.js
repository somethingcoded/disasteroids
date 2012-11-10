(function() {
  'use strict';

  sc.routers.Router = Backbone.Router.extend({
    routes: {
      '': 'lobby',
      'game': 'game',
      'results': 'results'
    },

    lobby: function() {
      this.renderWorldIfNot();
      appView.renderLobby();
    },

    game: function() {
      if (!app.currentPlayer) {
        return app.router.navigate('/', {trigger: true});
      }
      
      this.renderWorldIfNot();
      
      if (app.lobby) {
        app.lobby.trigger('exit');
        app.lobby = undefined;
      }
    },

    results: function() {
      this.renderWorldIfNot();
    },

    // utility function not a route
    renderWorldIfNot: function() {
      if (!window.app.world) {
        window.app.world = new sc.models.World();
        window.app.worldView = new sc.views.WorldView({model: window.app.world, el: $('.world')});
        window.app.worldView.render();
      } else if (!window.app.worldView.$el.children().length) {
        window.app.worldView.render();
      }
    }
  });
  
})();
