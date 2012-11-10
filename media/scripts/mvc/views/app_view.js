(function() {
  'use strict';

  sc.views.AppView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
    },

    template: _.template($('#app-template').html()),

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
