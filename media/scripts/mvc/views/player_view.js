(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      console.log('player view init');
      _.bindAll(this);
      this.model.on('change:x change:y change:angle', this.reposition);
      this.model.on('change:power change:shotAngle', this.logTest);
      this.model.on('remove', this.exit);

    },

    width: 50,
    height: 66,
    
    //object groups
    objects: [],
    hud: [],

    SVGData: {
      mech: {
        path: '/media/art/mech_01_stand_full.svg',
        x: 0,
        y: 0,
        width: 50,
        height: 66
      },
      angleMeter: {
        path: '/media/art/angles.svg',
        x: 0,
        y: -50,
        width: 176,
        height: 84
      }

    },

    // Remember to avoid memory leaks
    exit: function() {
      console.log('Player view remove');
      this.object.remove();
      this.model.off('change', this.reposition);
      this.model.off('remove', this.remove);
      $('body').unbind('keydown.player', this.routeKeypress);
      $('body').unbind('keyup.player', this.routeKeypress);
      this.unbind();
      this.remove();
    },

    logTest: function() {
      console.log('angle', this.model.get('shotAngle'));
      console.log('power', this.model.get('power'));
    },

    initKeyBindings: function() {
      $('body').bind('keydown.player', this.routeKeypress);
      $('body').bind('keyup.player', this.routeKeypress);
    },

    routeKeypress: function(e) {
      // return early if in an input
      if ($(e.target).is('input')) return;

      if (this.model.id != app.currentPlayer.id) return;

      if (e.keyCode == 13) {
        this.startChat(e);
      }
      
      if (e.keyCode >= 32 && e.keyCode <= 40) {
        this.handleArtilleryKeypress(e);
      } else {
        if (e.type == 'keydown') {
          this.handleMoveKeypress(e);
        } else {
          this.handleEndMoveKeypress(e);
        }
      }
    },

    startChat: function(e) {
      e.preventDefault();
      var $input = $('<input class="hover-chat-input" type="text" placeholder="Type here to chat" />');
      $input.css({left: this.model.get('x'), top: this.model.get('y')});
      appView.$el.append($input);
      $input.focus();
    },

    handleArtilleryKeypress: function(e) {
      var inc = e.shiftKey ? 10 : undefined;
      
      switch (e.keyCode) {
        case 38: // arrow up
          e.preventDefault();
          this.model.incPower(inc);
        break;
        case 40: // arrow down
          e.preventDefault();
          this.model.decPower(inc);
        break;
        case 37: // arrow left
          e.preventDefault();
          this.model.decShotAngle(inc);
        break;
        case 39: // right arrow
          e.preventDefault();
          this.model.incShotAngle(inc);
        break;
        case 32: // space
          e.preventDefault();
          this.model.emitShoot();
        break;

      }
    },

    handleMoveKeypress: function(e) {
      switch (e.keyCode) {
        case 65: // a
          e.preventDefault();
          this.model.emitMoveCCW();
        break;
        case 68: // d
          e.preventDefault();
          this.model.emitMoveCC();
        break;
        case 87: // w
          e.preventDefault();
          this.model.emitJump();
        break;
      }
    },

    handleEndMoveKeypress: function(e) {
      switch (e.keyCode) {
        case 65: // a
          e.preventDefault();
          this.model.emitEndMove();
        break;
        case 68: // d
          e.preventDefault();
          this.model.emitEndMove();
        break;
        case 87: // w
          e.preventDefault();
          this.model.emitEndMove();
        break;
      }
    },

    reposition: function(model) {
      var self = this;
      this.objects.set('left', self.model.get('x'));
      this.objects.set('top', self.model.get('y'));
      this.objects.setAngle(self.model.get('angle')*180/Math.PI);
    },
    
    //_renderSVG: function(SVGData
    render: function(canvas) {
      var self = this;
      this.initKeyBindings();
      
      this.objects = new fabric.Group();
      this.hud = new fabric.Group();

      // Basic Mech
      fabric.loadSVGFromURL(this.SVGData.mech.path, function(objects) {
        var group = new fabric.PathGroup(objects, {
          left: self.SVGData.mech.x,
          top: self.SVGData.mech.y,
          height: self.SVGData.mech.height,
          width: self.SVGData.mech.width,
          scaleX: self.model.get('width')/self.SVGData.mech.width,                                        
          scaleY: self.model.get('height')/self.SVGData.mech.height
        });
        group.SVGData = self.SVGData.mech;
        self.objects.add(group);
      });

      // Angle Meter
      fabric.loadSVGFromURL(this.SVGData.angleMeter.path, function(objects) {
        var group = new fabric.PathGroup(objects, {
          left: self.SVGData.angleMeter.x,
          top:  self.SVGData.angleMeter.y,
          height: self.SVGData.angleMeter.height,
          width: self.SVGData.angleMeter.width
        });
        group.SVGData = self.SVGData.angleMeter
        self.objects.add(group);
        self.hud.add(group);
      });

      self.objects.setAngle(self.model.get('angle')*180/Math.PI);
      canvas.add(self.objects);
    }
  });
})();
