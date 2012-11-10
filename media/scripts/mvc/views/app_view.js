(function() {
  'use strict';

  sc.views.AppView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.on('error', this.error);
      window.socket.on('error', this.error);
    },

    template: _.template($('#app-template').html()),

    error: function(err) {
      var $error = $('<div class="error">' + err + '</div>');
      this.$('.errors').append($error);
      setTimeout(function() {
        $error.fadeOut(function() {
          $error.remove();
        });  
      }, 5000);
    },

    renderLobby: function() {
      this.model.lobby = new sc.models.Lobby();
      var lobbyView = new sc.views.LobbyView({model: window.app.lobby});
      this.$el.append(lobbyView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
    
  });
  
})();
