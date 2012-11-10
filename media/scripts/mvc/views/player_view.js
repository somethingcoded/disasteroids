(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.on('change', this.reposition);
    },
    width: 50,
    height: 66,
    object: undefined,
    SVGPaths: {
      default: '/media/art/mech_01_stand_full_flush.svg'
    },

    reposition: function(model) {
      if (!this.object) {
        console.log('no player!');
        return;
      }
      var self = this;
      this.object.set('left',self.model.get('x'));
      this.object.set('top', self.model.get('y'));
      this.object.set('angle', self.model.get('angle')*180/Math.PI);
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
          scaleY: self.model.get('height')/self.height,
          angle: self.model.get('angle')*180/Math.PI
        });
        self.object = group;
        canvas.add(group);
      });
    }
  });
})();
