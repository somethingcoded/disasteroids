(function() {
  'use strict';

  sc.views.AsteroidView = Backbone.View.extend({
    initialize: function() {
      console.log('asteroid view init');
      _.bindAll(this);
      this.model.on('remove', this.exit);
    },
    // SVG asset dimensions
    width: 230,
    height: 222,
    angle: Math.floor(Math.random()*360),
    object: undefined,
    
    SVGPaths: {
      default: '/media/art/asteroid_0'+Math.ceil(Math.random()*5)+'.svg'
    },
    
    exit: function() {
      console.log('Asteroid View Exit');
      this.object.remove();
      this.model.off('remove', this.exit);
      this.unbind();
      this.remove();
    },

    render: function(canvas) {
      var self = this;
      fabric.loadSVGFromURL(this.SVGPaths.default, function(objects) {
        console.log(objects);
        var group = new fabric.PathGroup(objects, {
          left: self.model.get('x'),
          top: self.model.get('y'),
          height: self.height,
          width: self.width,
          angle: self.angle,
          scaleX: 2*self.model.get('radius')/self.width,
          scaleY: 2*self.model.get('radius')/self.height
        });
        self.object = group;
        canvas.add(group);
      });
    }
  });
})();
