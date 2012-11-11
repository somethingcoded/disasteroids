(function() {
  'use strict';

  sc.models.App = Backbone.Model.extend({
    initialize: function() {
      this.chatLog = new sc.models.ChatLog();
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
      if (app.audioEnabled) {
        this.audio[name].play();
      }
    },

    audio: {
      mortar: $('<audio src="/media/audio/mortar.mp3"></audio>')[0],
      fizzle: $('<audio src="/media/audio/fizzle.mp3"></audio>')[0],
      explosionWeak: $('<audio src="/media/audio/explosion_weak.mp3"></audio>')[0],
      hardImpact: $('<audio src="/media/audio/hard_impact.mp3"></audio>')[0],
      machine: $('<audio src="/media/audio/machine.mp3"></audio>')[0],
      whoosh: $('<audio src="/media/audio/whoosh.mp3"></audio>')[0],
    }
  });
  
})();
