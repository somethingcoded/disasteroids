(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
    },

    template: _.template($('#world-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderTest();
      return this;
    },

    renderTest: function() {
      var canvas = new fabric.Canvas(this.$el.find('canvas')[0])
      canvas.backgroundColor = 'black';
      fabric.loadSVGFromURL('/media/art/asteroid_01.svg', function(objects) { 
          var group = new fabric.PathGroup(objects, { 
          left: 100, 
          top: 100, 
          scaleX: .5,
          scaleY: .5
        }); 
        canvas.add(group); 
        canvas.renderAll(); 
          }); 
    }
    
  });
  
})();
