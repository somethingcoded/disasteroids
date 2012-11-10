(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    width: 80,
    height: 100,
    SVGPaths: {
      default: '/media/art/mech_01_stand_full.svg'
    } 

    render: function(canvas) {
      var self = this;
      fabric.loadSVGFromURL(this.SVGPaths.default, function(objects) {
        var group = new fabric.PathGroup(objects, {
          //left: self.model.get('x'),
          //top: self.model.get('y'),
          height: self.height,
          width: self.width
          //scaleX: 2*self.model.get('radius')/self.width,                                        
          //scaleY: 2*self.model.get('radius')/self.height
        });
        canvas.add(group);
        canvas.renderAll();      
      });
    }
  });
})();
