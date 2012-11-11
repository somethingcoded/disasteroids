(function() {
  'use strict';

  sc.views.AppView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.on('error', this.error);
      this.model.on('change:currentPlayer', this.currentPlayerSet);
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

    // goFullScreen: function() {
    //  // Get the element that we want to take into fullscreen mode
    //   var element = $('.main')[0];
    // 
    //   // These function will not exist in the browsers that don't support fullscreen mode yet, 
    //   // so we'll have to check to see if they're available before calling them.
    // 
    //   if (element.mozRequestFullScreen) {
    //     // This is how to go into fullscren mode in Firefox
    //     // Note the "moz" prefix, which is short for Mozilla.
    //     element.mozRequestFullScreen();
    //   } else if (element.webkitRequestFullScreen) {
    //     // This is how to go into fullscreen mode in Chrome and Safari
    //     // Both of those browsers are based on the Webkit project, hence the same prefix.
    //     element.webkitRequestFullScreen();
    //  }
    //  // Hooray, now we're in fullscreen mode!
    // },

    currentPlayerSet: function(model, currentPlayer) {
      this.model.currentPlayer = currentPlayer;
      this.model.worldView.renderStats();

      // this.goFullScreen();
    },

    renderLobby: function() {
      this.model.lobby = new sc.models.Lobby();
      var lobbyView = new sc.views.LobbyView({model: window.app.lobby});
      this.$el.append(lobbyView.render().el);
      this.$('.username').focus();
    },

    renderChatLog: function() {
      var chatLogView = new sc.views.ChatLogView({model: this.model.chatLog, el: this.$('.chat-log')});
      chatLogView.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderChatLog();

      $('.about').click(function(e) {
        e.preventDefault();
        var $aboutUs = $('.about-us');
        
        $aboutUs.find('.close').click(function(e) {
          e.preventDefault();
          $aboutUs.fadeOut();
        });
        
        if ($aboutUs.is(':visible')) {
          $aboutUs.fadeOut();
        } else {
          $aboutUs.fadeIn();
        }
      });
      
      return this;
    }
    
  });
  
})();
