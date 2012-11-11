(function() {
  'use strict';

  sc.models.Player = Backbone.Model.extend({
    initialize: function() {
      _.bindAll(this);

      window.socket.on('playerDied', this.playerDied);
      window.socket.on('suicide', this.suicide);
      window.socket.on('playerKilled', this.playerKilled);
    },

    defaults: {
      username: 'Mr. Rogers',
      life: 100,
      x: 0,
      y: 0,
      power: 50,
      shotAngle: 90,
      canShoot: true
    },

    incConstant: 1,

    powerRange: [0,100],

    shotAngleRange: [0,180],

    incPower: function(inc) {
      inc = inc || this.incConstant;
      var newPower = this.get('power') + inc;
      if (newPower >= this.powerRange[1]) {
        newPower = this.powerRange[1];
      }

      this.set({power: newPower});
    },

    decPower: function(dec) {
      dec = dec || this.incConstant;
      var newPower = this.get('power') - dec;
      if (newPower <= this.powerRange[0]) {
        newPower = this.powerRange[0];
      }

      this.set({power: newPower});
    },

    incShotAngle: function(inc) {
      inc = inc || this.incConstant;
      var newAngle = this.get('shotAngle') + inc;
      if (newAngle >= this.shotAngleRange[1]) {
        newAngle = this.shotAngleRange[1];
      }

      this.set({shotAngle: newAngle});
    },

    decShotAngle: function(dec) {
      dec = dec || this.incConstant;
      var newAngle = this.get('shotAngle') - dec;
      if (newAngle <= this.shotAngleRange[0]) {
        newAngle = this.shotAngleRange[0]; 
      }
      
      this.set({shotAngle: newAngle});

    },

    emitShoot: function() {
      if (this.get('canShoot')) {
        console.log('shootMissile');
        window.socket.emit('shootMissile', this.toJSON());
        this.set({canShoot: false});

        app.playAudio('rocketShoot');
      }
    },
    
    emitMoveCC: function() {
      if (!this.moving) {
        console.log('moveCC');
        window.socket.emit('moveCC', this.toJSON());
        this.moving = 'cc';

        app.playAudio('walk');
      }
    },

    emitMoveCCW: function() {
      if (!this.moving) {
        console.log('moveCCW');
        window.socket.emit('moveCCW', this.toJSON());
        this.moving = 'ccw';
        
        app.playAudio('walk');
      }
    },
    
    emitEndMove: function() {
      console.log('endMove');
      window.socket.emit('endMove', this.toJSON());
      this.moving = undefined;
    },
    
    emitJump: function() {
      if (!this.get('jumping')) {
        console.log('jump');
        window.socket.emit('jump', this.toJSON());
        app.playAudio('jump');
        this.set({jumping: true});
      }
    },

    // deprecated
    //emitEndJump: function() {
    //  console.log('endJump');
     // window.socket.emit('endJump', this.toJSON());
      //this.set({jumping: false});
    //},

    playerDied: function(data) {
      if (this.id == data.playerID) {
        this.trigger('playerDied');

        app.playAudio('playerExplosion');
      }
    },

    playerKilled: function(data) {
      if (data.killerID == app.currentPlayer.id) {
        app.world.trigger('message', 'You killed ' + app.players.get(data.killedID).get('username') + '!');
      } else if (data.killedId == app.currentPlayer.id) {
        app.world.trigger('message', app.players.get(data.killerID).get('username') + ' killed you.');
      }
    },

    suicide: function() {
      app.world.trigger('message', 'Congratulations, you self-destructed!');
    },

    missileDestroyed: function() {
      this.set({canShoot: true});
    }
  });

})();
