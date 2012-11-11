(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    baseWidth:2560,
    baseHeight:1440,
    getScaleFactor: function() {
      var self = this; 
      var viewWidth = this.$el.outerWidth();
      var viewHeight = this.$el.outerHeight();
      var wRatio = this.baseWidth/viewWidth;
      var hRatio = this.baseHeight/viewHeight;
      console.log(wRatio, hRatio);
      if (wRatio < 1 && hRatio < 1) {
        // window is bigger than playing field
        return 1; 
      } else if (hRatio >= wRatio) {
        // window too short fit height 
        console.log('width');
        return hRatio; 
      } else {
        // window too narrow fit width 
        return wRatio 
      }
    },

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
      var width = this.baseWidth;
      var height = this.baseHeight;

      // canvas element resize
      this.$canvas.css({width: width, height: height})
        .attr({width: width, height: height});

      // fabric canvas resize
      this.canvas.setWidth(width);
      this.canvas.setHeight(height);
      this.display.width = width;
      this.display.height = height;

      this.canvas.getContext('2d').scale(1/this.getScaleFactor(), 1/this.getScaleFactor());
    },

    renderStats: function() {
      var statsView = new sc.views.StatsView({model: app.currentPlayer});
      this.$el.append(statsView.render().el);
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.$canvas = this.$('#c');
      this.$canvas.attr({width: this.baseWidth, height: this.baseHeight});
      this.canvas = new fabric.StaticCanvas(this.$canvas[0]);
      this.canvas.backgroundColor = 'black';
      this.model.canvas = this.canvas;

      var drawLoop = function drawLoop() {
        window.requestAnimFrame(drawLoop);
        self.canvas.renderAll();
      }
      drawLoop(); // start drawing, sucka

      // init particle system
      this.display = new Display(this.canvas);
      this.display.init();
      this.particleSystem = new ParticleSystem().init(this.display);
      this.particleSystem.maxParticles = 10000;
      this.display.start();

      this.canvas.getContext('2d').scale(1/this.getScaleFactor(), 1/this.getScaleFactor());

      
      return this;
    }

    
  });
  
})();
