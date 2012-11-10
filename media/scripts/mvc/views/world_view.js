(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.asteroids.on('add', this.insertAsteroid);
      this.model.players.on('add', this.insertPlayer);
    },

    template: _.template($('#world-template').html()),

    insertPlayer: function(player) {
      console.log('insert player', player);
      var playerView = new sc.views.PlayerView({model: player});
      playerView.render(this.canvas);
    },

    insertAsteroid: function(asteroid) {
      console.log('insert asteroid', asteroid);
      var asteroidView = new sc.views.AsteroidView({model: asteroid});
      asteroidView.render(this.canvas);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.canvas = new fabric.StaticCanvas(this.$('canvas')[0]);
      this.canvas.backgroundColor = 'black';
      this.model.canvas = this.canvas;
      this.canvas.renderAll();
      //this.renderTest();
      return this;
    },

    renderTest: function() {
      var canvas = new fabric.StaticCanvas(this.$el.find('canvas')[0])
      canvas.backgroundColor = 'black';
      fabric.loadSVGFromURL('/media/art/asteroid_01.svg', function(objects) { 
          var group = new fabric.PathGroup(objects, { 
          left: 100, 
          top: 100, 
          height:300,
          width:300
//          scaleX: .5,
 //         scaleY: .5
        }); 
        canvas.add(group); 
        canvas.renderAll(); 
          }); 
    }
    
  });
  
})();
