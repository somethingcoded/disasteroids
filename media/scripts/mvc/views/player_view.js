(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      console.log('player view init');
      _.bindAll(this);
      this.model.on('change:x change:y change:angle', this.reposition);
      this.model.on('change:power change:shotAngle', this.logTest);
      this.model.on('remove', this.exit);

      this.initKeyBindings();
    },

    width: 50,
    height: 66,
    object: undefined,
    SVGPaths: {
      default: '/media/art/mech_01_stand_full.svg'
    },

    // Remember to avoid memory leaks
    exit: function() {
      console.log('Player view remove');
      this.object.remove();
      this.model.off('change', this.reposition);
      this.model.off('remove', this.remove);
      this.unbind();
      this.remove();
    },

    logTest: function() {
      console.log('angle', this.model.get('shotAngle'));
      console.log('power', this.model.get('power'));
    },

    initKeyBindings: function() {
      appView.$el.bind('keypress', this.handleKeypress);
    },

    handleKeypress: function(e) {
      switch (e.keyCode) {
        case 38: // arrow up
          this.model.incPower();
        break;
        case 40: // arrow down
          this.model.decPower();
        break;
        case 37: // arrow left
          this.model.decShotAngle();
        break;
        case 39: // right arrow
          this.model.incShotAngle();
        break;
      }
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
