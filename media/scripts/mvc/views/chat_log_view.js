(function() {
  'use strict';

  sc.views.ChatLogView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.chats.on('add', this.insertChat);
    },

    events: {
      'keypress .chat-log-input': 'chatLogInputKeypress',
      'click .submit-chat': 'submitChat'
    },

    template: _.template($('#chat-log-template').html()),

    chatLogInputKeypress: function(e) {
      if (e.keyCode == 13) {
        this.submitChat(e);
      }
    },

    submitChat: function(e) {
      e.preventDefault();
      var msg = this.$chatLogInput.val();
      this.model.chats.add({username: app.currentPlayer, msg: msg});
      this.$chatLogInput.val('');

      window.socket.emit('chat', {username: app.currentPlayer, msg: msg});
    },

    insertChat: function(chat) {
      var chatView = new sc.views.ChatView({model: chat});
      this.$chats.append(chatView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$chats = this.$('.chats');
      this.$chatLogInput = this.$('.chat-log-input');
      return this;
    }
  });
  
})();
