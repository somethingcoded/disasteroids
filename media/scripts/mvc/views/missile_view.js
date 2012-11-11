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
      var self = this;
      console.log('missile view exit');
      
      this.particleSystem.removeEmitter(this.thruster);

      this.explosion = new Emitter();
      this.explosion.position = new Vector(this.model.get('x'), this.model.get('y'));
      this.explosion.velocity = new Vector(0, 5);
      this.explosion.size = 0;
      this.explosion.particleColor = [255,50,0,1];
      this.explosion.spread = 50;
      this.explosion.emissionRate = 10;
      this.explosion.particleLife = 7;
      this.particleSystem.emitters.push(this.explosion);
      
      this.object.remove();
      this.model.off('change', this.reposition);
      this.model.off('remove', this.exit);
      this.unbind();
      this.remove();
      
      setTimeout(function() {
        self.particleSystem.removeEmitter(self.explosion);
      }, 250);
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

      this.thruster.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.thruster.velocity = Vector.fromAngle(self.model.get('angle') + Math.PI/2, 2);
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
      this.thruster = new Emitter();
      this.thruster.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.thruster.velocity = Vector.fromAngle(self.model.get('angle')*180/Math.PI, 5);
      this.thruster.size = 0;
      this.thruster.particleLife = 100;
      this.thruster.spread = .5;
      this.thruster.emissionRate = 0.5;
      this.thruster.jitter = 0;
      this.thruster.particleColor = [255,130,0,1];
      particleSystem.emitters.push(this.thruster);
    }
  });
})();
