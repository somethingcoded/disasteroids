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
      if (!msg) return;
      
      this.model.chats.add({username: app.username, msg: msg});
      this.$chatLogInput.val('');
      window.socket.emit('chat', {username: app.username, msg: msg});
    },

    insertChat: function(chat) {
      var chatView = new sc.views.ChatView({model: chat});
      this.$chats.append(chatView.render().el);
      this.$chatsWrapper.scrollTop(this.$chats.outerHeight());
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$chatsWrapper = this.$('.chats-wrapper');
      this.$chats = this.$('.chats');
      this.$chatLogInput = this.$('.chat-log-input');
      return this;
    }
  });
  
})();
