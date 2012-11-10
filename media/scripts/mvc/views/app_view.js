(function() {
  'use strict';

  sc.views.AppView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.on('error', this.error);
      window.socket.on('error', this.error);
      window.socket.on('chat', this.routeChat);
    },

    template: _.template($('#app-template').html()),

    routeChat: function(chat) {
      // this should also make the chat show above the user somehow
      
      this.model.chatLog.chats.add(chat);
    },

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

    renderChatLog: function() {
      var chatLogView = new sc.views.ChatLogView({model: this.model.chatLog, el: this.$('.chat-log')});
      chatLogView.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderChatLog();
      return this;
    }
    
  });
  
})();
