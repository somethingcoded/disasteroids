(function() {
  'use strict';

  sc.models.Player = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      username: 'Mr. Rogers',
      life: 100,
      x: 0,
      y: 0,
      power: 50,
      shotAngle: 90
    },

    incConstant: .5,

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
    
    }
    
  });

})();
