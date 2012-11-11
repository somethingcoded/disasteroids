(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.asteroids.on('add', this.insertAsteroid);
      this.model.players.on('add', this.insertPlayer);
      this.model.missiles.on('add', this.insertMissile);

      $(window).bind('resize', this.resizeCanvas);
    },

    template: _.template($('#world-template').html()),

    insertPlayer: function(player) {
      console.log('insert player', player);
      var playerView = new sc.views.PlayerView({model: player});
      playerView.render(this.canvas, this.particleSystem);
    },

    insertAsteroid: function(asteroid) {
      console.log('insert asteroid', asteroid);
      var asteroidView = new sc.views.AsteroidView({model: asteroid});
      asteroidView.render(this.canvas, this.particleSystem);
    },

    insertMissile: function(missile) {
      console.log('insert missile', missile);
      var missileView = new sc.views.MissileView({model: missile}); 
      missileView.render(this.canvas, this.particleSystem);
    },

    resizeCanvas: function() {
      // get heights
      var width = this.$el.outerWidth();
      var height = this.$el.outerHeight();

      // canvas element resize
      this.$canvas.css({width: width, height: height})
        .attr({width: width, height: height});

      // fabric canvas resize
      this.canvas.setWidth(width);
      this.canvas.setHeight(height);

    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.$canvas = this.$('#c');
      this.$canvas.attr({width: this.$el.outerWidth(), height: this.$el.outerHeight()});
      this.canvas = new fabric.StaticCanvas(this.$canvas[0]);
      this.canvas.backgroundColor = 'black';
      this.model.canvas = this.canvas;

      var drawLoop = function drawLoop() {
        window.requestAnimFrame(drawLoop);
        self.canvas.renderAll();
      }
      drawLoop(); // start drawing, sucka

      // init particle system
      var display = new Display(this.canvas);
      display.init();
      this.particleSystem = new ParticleSystem().init(display);
      this.particleSystem.maxParticles = 10000;
      display.start();
      
      return this;
    }

    
  });
  
})();
