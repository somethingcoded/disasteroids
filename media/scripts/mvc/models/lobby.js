(function() {
  
  sc.models.Lobby = Backbone.Model.extend({
    initialize: function() {
      this.on('change:username', this.submitLogin);
      window.socket.on('loggedIn', this.loggedIn);
      window.socket.on('loginError', this.loginError);
    },

    submitLogin: function(model, username) {
      window.socket.emit('login', {username: username});
    },

    loggedIn: function(data) {
      app.currentPlayer = data.username;
      app.router.navigate('game', {trigger: true});
    },

    loginError: function(err) {
      app.trigger('error', err);
    }
  });
})();
