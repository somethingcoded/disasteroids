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
      if (wRatio < 1 && hRatio < 1) {
        // window is bigger than playing field
        return 1; 
      } else if (hRatio >= wRatio) {
        // window too short fit height 
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

      this.model.on('message', this.displayMessage);

      $(window).bind('resize', this.resizeCanvas);
    },

    template: _.template($('#world-template').html()),

    displayMessage: function(msg) {
      var $el = $('<div class="kill-message">' + msg + '</div>');
      this.$el.append($el);
      setTimeout(function() {
        $el.fadeOut();
      }, 750);
    },

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

      this.canvas.getContext('2d').fillStyle = "rgba(14, 14, 14, 1.0)";
      this.canvas.getContext('2d').fillRect(0,0,this.canvas.width,this.canvas.height);
      this.canvas.getContext('2d').scale(1/this.getScaleFactor(), 1/this.getScaleFactor());
      var x = (this.$el.outerWidth()-(this.baseWidth/this.getScaleFactor()))/2;
      console.log(x);
      var y = (this.$el.outerHeight()-(this.baseHeight/this.getScaleFactor()))/2;
      this.canvas.getContext('2d').translate(x*this.getScaleFactor(), y*this.getScaleFactor()); 
 
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
      this.canvas.getContext('2d').fillStyle = "rgba(14, 14, 14, 1.0)";
      this.canvas.getContext('2d').fillRect(0,0,this.canvas.width,this.canvas.height);
      this.canvas.backgroundColor = 'rgba(0, 0, 0, 0.0)';
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
      
      // canvas scaling hax
      this.canvas.getContext('2d').scale(1/this.getScaleFactor(), 1/this.getScaleFactor());
      var x = (this.$el.outerWidth()-(this.baseWidth/this.getScaleFactor()))/2;
      var y = (this.$el.outerHeight()-(this.baseHeight/this.getScaleFactor()))/2;
      this.canvas.getContext('2d').translate(x*this.getScaleFactor(), y*this.getScaleFactor()); 

      // logo scale
      $('.logo img').width(self.$el.outerWidth()/7);
      return this;
    }
  });
})();
