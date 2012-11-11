(function() {
  'use strict';

  sc.models.App = Backbone.Model.extend({
    initialize: function() {
      this.detectAudioSupport();
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

    audioSuffix: undefined,

    detectAudioSupport: function() {
      var suffix = this.suffix = undefined;
      var audio = document.createElement('audio');
      if (audio.canPlayType('audio/mpeg;')) {
        suffix = 'mp3';
      } else {
        suffix = 'ogg';
      }    
      
      this.audio = {
        rocketShoot: $('<audio src="/media/audio/rocket_shoot.' + suffix + '"></audio>')[0],
        rocketImpact: $('<audio src="/media/audio/rocket_impact.' + suffix + '"></audio>')[0],
        asteroidExplosion: $('<audio src="/media/audio/asteroid_explosion.' + suffix + '"></audio>')[0],
        playerExplosion: $('<audio src="/media/audio/player_explosion.' + suffix + '"></audio>')[0],
        walk: $('<audio src="/media/audio/walk.' + suffix + '"></audio>')[0],
        jump: $('<audio src="/media/audio/jump.' + suffix + '"></audio>')[0],
      }
    },

    audioEnabled: true,

    playAudio: function(name) {
      if (app.get('audioEnabled')) {
        this.audio[name].play();
      }
    },

  });
  
})();
