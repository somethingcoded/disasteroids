(function() {
  'use strict';

  sc.views.PlayerView = Backbone.View.extend({
    initialize: function() {
      console.log('player view init');
      _.bindAll(this);
      this.model.on('change:x change:y change:angle', this.reposition);
      this.model.on('change:power change:shotAngle', this.aimRender);
      this.model.on('change:jumping', this.jumpingChanged);
      this.model.on('change:onAsteroid', this.onAsteroidChanged);
      this.model.on('remove', this.exit);
      this.model.on('playerDied', this.blowUp);
      app.chatLog.chats.on('add', this.displayChat);
    },

    width: 50,
    height: 66,
    
    //object groups
    objects: null,
    hud: null,
    text: null,
    chat: null,
    aimers: null, 

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
        y: -44,
        width: 176,
        height: 84
      },
      needle: {
        path: '/media/art/target_needle.svg',
        x:0,
        y: -7,
        width: 248,
        height: 2
      }


    },

    blowUp: function() {
      var self = this;
      console.log('Player view remove');

      // explode
      this.littleBlast = new Emitter();
      this.littleBlast.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.littleBlast.velocity = Vector.fromAngle(0,5);
      this.littleBlast.size = 0;
      this.littleBlast.particleLife = 65;
      // this.emitter.spread = Math.PI / 64;
      this.littleBlast.spread = 50;
      this.littleBlast.emissionRate = 25;
      this.littleBlast.jitter = 50;
      this.littleBlast.drawColor = 'rgba(0,0,0,0)';
      this.littleBlast.drawColor2 = 'rgba(0,0,0,0)';
      this.littleBlast.particleColor = [184,255,82,1];
      this.littleBlast.particleSize = 1;
      
      this.bigBlast = new Emitter();
      this.bigBlast.position = new Vector(self.model.get('x'), self.model.get('y'));
      this.bigBlast.velocity = new Vector(0, 2);
      this.bigBlast.size = 0;
      this.bigBlast.particleLife = 50;
      this.bigBlast.spread = 50;
      this.bigBlast.emissionRate = 3;
      this.bigBlast.drawColor = 'rgba(0,0,0,0)';
      this.bigBlast.drawColor2 = 'rgba(0,0,0,0)';
      this.bigBlast.particleColor = [184,255,82,1];
      this.bigBlast.particleSize = 5;
      this.particleSystem.emitters.push(this.littleBlast);
      this.particleSystem.emitters.push(this.bigBlast); 
      
      setTimeout(function() {
        self.particleSystem.removeEmitter(self.littleBlast);
        self.particleSystem.removeEmitter(self.bigBlast);
      }, 500); 
    },

    // Remember to avoid memory leaks
    exit: function() {
      this.blowUp();
      
      app.world.canvas.remove(this.objects);
      app.world.canvas.remove(this.chat);
      app.world.canvas.remove(this.text);
      
      this.model.off('playerDied', this.blowUp);
      this.model.off('change:jumping', this.jumpingChanged);
      this.model.off('change', this.reposition);
      this.model.off('remove', this.remove);
      this.model.off('change:onAsteroid', this.onAsteroidChanged);
      app.chatLog.chats.off('add', this.displayChat);
      $('body').unbind('keydown.player', this.routeKeypress);
      $('body').unbind('keyup.player', this.routeKeypress);
      this.unbind();
      this.remove();
    },

    aimRender: function() {
      console.log('angle', this.model.get('shotAngle'));
      console.log('power', this.model.get('power'));
      var self = this; 
      self.renderPower();
      self.renderNeedle();
    },

    renderNeedle: function() {
      var self = this;
      var shotAngle = self.model.get('shotAngle');

      self.aimers.forEachObject(function(object){
        object.setAngle(shotAngle); 
      }); 
    },

    initKeyBindings: function() {
      $('body').bind('keydown.player', this.routeKeypress);
      $('body').bind('keyup.player', this.routeKeypress);
    },

    routeKeypress: function(e) {

      if (this.model.id != app.currentPlayer.id) return;

      if (e.keyCode == 13 && e.type == 'keyup') {
        // return early if in an input
        if ($(e.target).is('input')) {
          return $(e.target).blur();
        } else {
          this.startChat(e);
        }
      }
      

      if ($(e.target).is('input')) return;
      
      if (e.keyCode >= 32 && e.keyCode <= 40) {
        if (e.type == 'keydown') {
          this.handleArtilleryKeypress(e);
        }
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
          //e.preventDefault();
          //this.model.emitEndJump();
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

    jumpingChanged: function(model, jumping) {
      //if (jumping) {
      //  this.renderThruster();
      //} else {
      //  this.removeThruster();
      //}
    },
    
    onAsteroidChanged: function(model, onAsteroid) {
      if (onAsteroid) {
        model.set({'jumping':false});
      }
     // else {
      //  model.set({'jumping':true});
     // }
    },
    renderThruster: function() {
      var self = this;
      this.thruster = new Emitter();
      var thrusterVector = Vector.fromAngle(self.model.get('angle') + Math.PI/2, self.model.get('height')/2);
      this.thruster.position = new Vector(self.model.get('x') + thrusterVector.x, self.model.get('y') + thrusterVector.y);
      this.thruster.velocity = Vector.fromAngle(self.model.get('angle') + Math.PI/2,.5);
      this.thruster.size = 0;
      this.thruster.particleLife = 80;
      this.thruster.spread = 10;
      this.thruster.emissionRate = 25;
      this.thruster.jitter = 50;
      this.thruster.particleColor = [255,130,0,1];
      this.thruster.particleSize = 1;

      this.thrusterFields = []
      for (var i = 0; i < 7; i++) {
        var fieldVector = Vector.fromAngle((self.model.get('angle') + Math.PI/2) + (i+1)*Math.PI/4, 150);
        var fieldPoint = new Vector(fieldVector.x + this.thruster.position.x, fieldVector.y + this.thruster.position.y);
        var field = new Field(fieldPoint, -500);
        field.size = 0;
        this.thrusterFields.push(field);
        this.particleSystem.fields.push(field);
      }

      this.particleSystem.emitters.push(this.thruster);
    },
    
    removeThruster: function() {
      var self = this;
      this.particleSystem.removeEmitter(this.thruster);

      setTimeout(function() {
        _.each(self.thrusterFields, function(field) {
          self.particleSystem.removeField(field);
        });
      },1000);

    },
    
    renderPower: function() {
      var self = this;
      if (!self.powerBar || !self.powerText)
        return;
      var power = self.model.get('power');
      // text 
      self.powerText.setText(power+'%');
      // bar
      self.powerBar.forEachObject(function(o){
        self.powerBar.remove(o);
      });
      var totalSteps = 50;
      var start = [1,169,244];
      var end = [156,203,244];
      var steps = Math.floor(power/2);
      for (var i = 0; i < steps; i++) {
        var bar = new fabric.Rect({
          width: 8,
          height: 1,
          left: 0,
          top: -i*2,
          fill: 'rgb('+Math.floor(start[0] + i*(end[0]-start[0])/50)+', ' + Math.floor(start[1] + i*(end[1]-start[1])/50)+', ' + Math.floor(start[2] + i*(end[2]-start[2])/50) +')'
        });
        self.powerBar.add(bar);
      }
    },

    render: function(canvas, particleSystem) {
      var self = this;
      this.initKeyBindings();

      this.particleSystem = particleSystem;
      
      this.objects = new fabric.Group();
      this.hud = new fabric.Group();
      this.text = new fabric.Group();
      this.chat = new fabric.Group();
      this.aimers = new fabric.Group();

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

        // Needle
        fabric.loadSVGFromURL(this.SVGData.needle.path, function(objects) {
          var group = new fabric.PathGroup(objects, {
            left: self.SVGData.needle.x,
            top:  self.SVGData.needle.y,
            height: self.SVGData.needle.height,
            width: self.SVGData.needle.width,
            angle: self.model.get('shotAngle')
          });
          self.objects.add(group);
          self.hud.add(group);
          self.aimers.add(group);
        });

        // Power Bar
        var powerGroup = new fabric.Group([],{
          left: 110,
          top: -7
        });
        var powerBar = new fabric.Group([], {
          height: 100,
          width: 8,
          top: -10
        });
        var powerText = new fabric.Text(self.model.get('power')+'%', {
          //top: 40,
          fontFamily: 'abel',
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#01A9F4'
        });
        powerGroup.add(powerText);
        powerGroup.add(powerBar);
        self.powerBar = powerBar;
        self.powerText = powerText;
        self.renderPower();

        self.objects.add(powerGroup);
        self.hud.add(powerGroup);
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
      //canvas.add(self.aimers);
    }
  });
})();
