(function() {
  'use strict';

  sc.models.Player = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      username: 'Mr. Rogers',
      life: 100,
      x: 0,
      y: 0
    },

    incPower: function(inc) {
      inc = inc || .10;
      this.set({power: this.get('power') + inc});
    },

    decPower: function(dec) {
      dec = dec || .10;
      this.set({power: this.get('power') - dec});
    },

    incShotAngle: function(inc) {
      inc = inc || .10;
      this.set({angle: this.get('angle') + inc});
    },

    decShotAngle: function(dec) {
      dec = dec || .10;
      this.set({angle: this.get('angle') - dec});
    }
    
  });

})();
