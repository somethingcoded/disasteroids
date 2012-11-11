(function() {
  'use strict';

  sc.models.App = Backbone.Model.extend({
    initialize: function() {
      this.chatLog = new sc.models.ChatLog();
    },

    defaults: {
      audioEnabled: true
    },

    router: new sc.routers.Router,

    start: function() {
      var model = this;
      
      socket.on('sync', function(data) {
        model.world.parse(data);
      });
      
      Backbone.history.start({pushState: true});
    },

    audioEnabled: true,

    playAudio: function(name) {
      if (app.get('audioEnabled')) {
        this.audio[name].play();
      }
    },

    audio: {
      rocket_shoot: $('<audio src="/media/audio/rocket_shoot.mp3"></audio>')[0],
      rocket_impact: $('<audio src="/media/audio/rocket_impact.mp3"></audio>')[0],
      asteroid_explosion: $('<audio src="/media/audio/asteroid_explosion.mp3"></audio>')[0],
      player_explosion: $('<audio src="/media/audio/player_explosion.mp3"></audio>')[0],
      walk: $('<audio src="/media/audio/walk.mp3"></audio>')[0],
      jump: $('<audio src="/media/audio/jump.mp3"></audio>')[0],
    }
  });
  
})();
