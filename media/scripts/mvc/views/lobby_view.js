(function() {
  'use strict';
  
  sc.views.LobbyView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
    },

    events: {
      'click .login': 'login'
    },

    login: function(e) {
      e.preventDefault();
      var username = this.$('.username').val();
      this.model.set({username: username});
    },

    template: _.template($('#login-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
})();
