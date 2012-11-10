(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.asteroids.on('add', this.insertAsteroid);
    },

    template: _.template($('#world-template').html()),

    insertAsteroid: function(asteroid) {
      console.log(asteroid);
      var asteroidView = new sc.views.AsteroidView({model: asteroid});
      asteroidView.render(this.canvas);

    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.canvas = new fabric.StaticCanvas(this.$('canvas')[0]);
      this.canvas.backgroundColor = 'black';
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
