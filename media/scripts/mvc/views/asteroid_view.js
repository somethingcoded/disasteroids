(function() {
  'use strict';

  sc.views.AsteroidView = Backbone.View.extend({
    // SVG asset dimensions
    height: 300,
    width: 300,

    SVGPath: '/media/art/asteroid_01.svg',
    render: function(canvas) {
      var self = this;
      fabric.loadSVGFromURL(this.SVGPath, function(objects) {
        var group = new fabric.PathGroup(objects, {
          left: self.model.get('x'),
          top: self.model.get('y'),
          height: self.height,
          width: self.width,
          scaleX: 2*self.model.get('radius')/self.width,
          scaleY: 2*self.model.get('radius')/self.height
        });
        canvas.add(group);
        canvas.renderAll();
      });
    }
  });
})();
