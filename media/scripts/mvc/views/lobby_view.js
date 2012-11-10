(function() {
  'use strict';
  
  sc.views.LobbyView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.on('exit', this.exit);
    },

    events: {
      'click .login': 'login',
      'keypress .username': 'loginKeypress'
    },
    
    template: _.template($('#login-template').html()),

    className: 'lobby',

    loginKeypress: function(e) {
      if (e.keyCode == 13) {
        this.login(e);
      }
    },

    login: function(e) {
      e.preventDefault();
      var username = this.$('.username').val();
      this.model.set({username: username});
    },

    exit: function() {
      var view = this;
      this.$el.fadeOut('fast', function() {
        view.remove();
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
})();
