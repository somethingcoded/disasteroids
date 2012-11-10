(function() {
  'use strict';

  sc.views.AsteroidView = Backbone.View.extend({
    // SVG asset dimensions
    width: 300,
    height: 300,
    object: undefined,

    SVGPath: '/media/art/asteroid_01.svg',
    render: function(canvas) {
      var self = this;
      fabric.loadSVGFromURL(this.SVGPath, function(objects) {
        console.log(objects);
        var group = new fabric.PathGroup(objects, {
          left: self.model.get('x'),
          top: self.model.get('y'),
          height: self.height,
          width: self.width,
          scaleX: 2*self.model.get('radius')/self.width,
          scaleY: 2*self.model.get('radius')/self.height
        });
        self.object = group;
        canvas.add(group);
      });
    }
  });
})();
