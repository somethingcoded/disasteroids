(function() {
  'use strict';

  sc.views.AsteroidView = Backbone.View.extend({
    initialize: function() {
      console.log('asteroid view init');
      _.bindAll(this);
      this.model.on('remove', this.exit);
      this.angle = Math.floor(Math.random()*360);
    },
    // SVG asset dimensions
    width: 230,
    height: 222,
    angle: 0, 
    object: undefined,
    
    SVGPaths: {
      asteroid1: '/media/art/asteroid_01.svg',
      asteroid2: '/media/art/asteroid_02.svg',
      asteroid3: '/media/art/asteroid_03.svg',
      asteroid4: '/media/art/asteroid_04.svg',
      asteroid5: '/media/art/asteroid_05.svg'
    },
    
    exit: function() {
      console.log('Asteroid View Exit');
      this.object.remove();
      this.model.off('remove', this.exit);
      this.unbind();
      this.remove();
      // this.particleSystem.removeField(this.field);
    },

    render: function(canvas, particleSystem) {
      var self = this;

      // add particle gravity
      // this.particleSystem = particleSystem;
      // var point = new Vector(self.model.get('x'), self.model.get('y'));
      // var mass = self.model.get('radius') * self.model.get('radius');
      // this.field = new Field(point, mass);
      // this.field.size = self.model.get('radius') * 2;
      // this.particleSystem.fields.push(this.field);
      
      var path = this.SVGPaths['asteroid'+Math.ceil(Math.random()*5)];
      fabric.loadSVGFromURL(path, function(objects) {
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
