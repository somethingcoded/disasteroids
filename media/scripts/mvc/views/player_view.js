(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.on('change', this.reposition);
    },
    width: 80,
    height: 100,
    object: undefined,
    SVGPaths: {
      default: '/media/art/mech_01_stand_full.svg'
    },

    reposition: function(model) {
      if (!this.object) {
        console.log('no player!');
        return;
      }
      var self = this;
      this.object.set('left',self.model.get('x'));
      this.object.set('top', self.model.get('y'));
      app.world.canvas.renderAll();
    },

    render: function(canvas) {
      var self = this;
      fabric.loadSVGFromURL(this.SVGPaths.default, function(objects) {
        var group = new fabric.PathGroup(objects, {
          left: self.model.get('x'),
          top: self.model.get('y'),
          height: self.height,
          width: self.width,
          scaleX: self.model.get('width')/self.width,                                        
          scaleY: self.model.get('height')/self.height
        });
        self.object = group;
        canvas.add(group);
        canvas.renderAll();      
      });
    }
  });
})();
