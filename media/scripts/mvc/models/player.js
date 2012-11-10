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
      if (this.get('power') >= powerRange[1]) return; 
      this.set({power: this.get('power') + inc});
    },

    decPower: function(dec) {
      dec = dec || this.incConstant;
      if (this.get('power') <= powerRange[0]) return; 
      this.set({power: this.get('power') - dec});
    },

    incShotAngle: function(inc) {
      inc = inc || this.incConstant;
      this.set({shotAngle: this.get('shotAngle') + inc});
    },

    decShotAngle: function(dec) {
      dec = dec || this.incConstant;
      this.set({shotAngle: this.get('shotAngle') - dec});
    }
    
  });

})();
