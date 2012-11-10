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

    incConstant: .1,

    incPower: function(inc) {
      inc = inc || this.incConstant;
      this.set({power: this.get('power') + inc});
    },

    decPower: function(dec) {
      dec = dec || this.incConstant;
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
