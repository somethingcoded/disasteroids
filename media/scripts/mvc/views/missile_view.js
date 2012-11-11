(function() {
  'use strict';

  sc.views.MissileView = Backbone.View.extend({
    initialize: function() {
      console.log('missle view init');
      _.bindAll(this);
      this.model.on('change', this.reposition);
      this.model.on('remove', this.exit);
    },
    width: 8,
    height: 16,
    object: undefined,
    SVGPaths: {
      default: '/media/art/rocket.svg'
    },

    // memory cleanup
    exit: function() {
      console.log('missile view exit');
      this.object.remove();
      this.model.off('change', this.reposition);
      this.model.off('remove', this.exit);
      this.unbind();
      this.remove();
      this.particleSystem.removeEmitter(this.emitter);
    },

    reposition: function(model) {
      if (!this.object) {
        console.log('no missile!');
        return;
      }
      var self = this;
      this.object.set('left',self.model.get('x'));
      this.object.set('top', self.model.get('y'));
      this.object.set('angle', self.model.get('angle')*180/Math.PI);

      this.emitter.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.emitter.velocity = Vector.fromAngle(self.model.get('angle')*180/Math.PI, 2);
    },
     
    render: function(canvas, particleSystem) {
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

      this.particleSystem = particleSystem;
      this.emitter = new Emitter();
      this.emitter.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.emitter.velocity = Vector.fromAngle(self.model.get('angle')*180/Math.PI, 2);
      this.emitter.size = 0;
      this.emitter.particleLife = 100;
      this.emitter.spread = Math.PI / 32;
      this.emitter.emissionRate = 1;
      // emitter.jitter = 1;
      particleSystem.emitters.push(this.emitter)

      // particleSystem.addEmitter(new Vector(0, 0), Vector.fromAngle(0, 2));
      // particleSystem.addField(new Vector(700, 230), -140);
    }
  });
})();
