(function() {
  
  sc.models.Lobby = Backbone.Model.extend({
    initialize: function() {
      this.on('change:username', this.submitLogin);
    },

    submitLogin: function(model, username) {
      window.socket.emit('login', {username: username});
    }
  });
})();
