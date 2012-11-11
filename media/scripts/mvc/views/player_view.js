(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      console.log('player view init');
      _.bindAll(this);
      this.model.on('change:x change:y change:angle', this.reposition);
      this.model.on('change:power change:shotAngle', this.logTest);
      this.model.on('remove', this.exit);
      app.chatLog.chats.on('add', this.displayChat);
    },
    
    width: 50,
    height: 66,
    
    //object groups
    objects: null,
    hud: null,
    text: null,

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

      // explode
      this.littleBlast = new Emitter();
      this.littleBlast.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.littleBlast.velocity = Vector.fromAngle(0,5);
      this.littleBlast.size = self.model.get('radius') * 2;
      this.littleBlast.particleLife = 100;
      // this.emitter.spread = Math.PI / 64;
      this.littleBlast.spread = 50;
      this.littleBlast.emissionRate = 25;
      this.littleBlast.jitter = 50;
      this.littleBlast.drawColor = 'rgba(0,0,0,0)';
      this.littleBlast.drawColor2 = 'rgba(0,0,0,0)';
      this.littleBlast.particleColor = [255,255,255,1];
      this.littleBlast.particleSize = 1;

      this.bigBlast = new Emitter();
      this.bigBlast.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.bigBlast.velocity = new Vector(0, 2);
      this.bigBlast.size = self.model.get('radius');
      this.bigBlast.particleLife = 50;
      this.bigBlast.spread = 50;
      this.bigBlast.emissionRate = 3;
      this.bigBlast.drawColor = 'rgba(0,0,0,0)';
      this.bigBlast.drawColor2 = 'rgba(0,0,0,0)';
      this.bigBlast.particleColor = [255,255,255,1];
      this.bigBlast.particleSize = 5;
      this.particleSystem.emitters.push(this.littleBlast);
      this.particleSystem.emitters.push(this.bigBlast);
      
      this.objects.remove();
      this.hud.remove();
      this.text.remove();
      this.chat.remove();
      this.model.off('change', this.reposition);
      this.model.off('remove', this.remove);
      app.chatLog.chats.off('add', this.displayChat);
      $('body').unbind('keydown.player', this.routeKeypress);
      $('body').unbind('keyup.player', this.routeKeypress);
      this.unbind();
      this.remove();

      setTimeout(function() {
        this.particleSystem.removeEmitter(this.littleBlast);
        this.particleSystem.removeEmitter(this.bigBlast);
      }, 500); 
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
      var $input = $('.chat-log-input');
      $input.focus();
    },
      
    chatTimeout: null,
    displayChat: function(chat) {
      if (chat.get('msg').length > 50)
        return; // Ignore long messages

      var self = this;
      if (chat.get('username') === this.model.get('username')){
        if (this.chat) {
          this.chat.forEachObject(function(e){
            self.chat.remove(e);
          });
          if (self.chatTimeout) {
            clearTimeout(self.chatTimeout);
          }
        }
        var chatText = new fabric.Text(chat.get('msg'), {
          fontFamily: 'abel',
          fontSize: 14,
          fill: '#FFFFFF',
          textAlign: 'left',
          fontWeight: 'bold'
        });
        chatText.set('top', 60);
        var chatBubble = new fabric.Rect({
          height: chatText.height+4,
          width: chatText.width+4,
          rx: 5,
          ry: 5,
          top:chatText.top,
          fill: '#000000',
          opacity: .75
        });
        this.chat.add(chatBubble);
        this.chat.add(chatText);
        this.chat.bringToFront();
        this.chat.setOpacity(1);
        this.chatTimeout = setTimeout(function() {
          self.hideChat();  
        }, 8000);
      }
    },
    hideChat: function() {
      var self = this;
      self.chat.animate({opacity:0});
      //this.chat.forEachObject(function(e){
      //  self.chat.remove(e);
      //});
      if (self.chatTimeout) {
        clearTimeout(self.chatTimeout);
      } 
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
      this.chat.set('left', self.model.get('x'));
      this.chat.set('top', self.model.get('y'));
      this.text.set('left', self.model.get('x'));
      this.text.set('top', self.model.get('y'));
      this.objects.set('left', self.model.get('x'));
      this.objects.set('top', self.model.get('y'));
      this.objects.setAngle(self.model.get('angle')*180/Math.PI);
    },
    
    //_renderSVG: function(SVGData
    render: function(canvas, particleSystem) {
      var self = this;
      this.initKeyBindings();

      this.particleSystem = particleSystem;
      
      this.objects = new fabric.Group();
      this.hud = new fabric.Group();
      this.text = new fabric.Group();
      this.chat = new fabric.Group();

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
      
      if (app.currentPlayer == self.model) {
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
      }
      
      // player names
      if (app.currentPlayer != self.model) {
        var playerName = new fabric.Text(self.model.get('username'), { 
            fontFamily: 'abel', 
            left: 0, 
            top: -50,
            fontSize: 14,
            fill: "#FFFFFF"
        });
        self.text.add(playerName);
      }

      self.reposition();
      canvas.add(self.chat);
      canvas.add(self.text);
      canvas.add(self.objects);
    }
  });
})();
