(function() {
  'use strict';

  sc.models.Missile = Backbone.Model.extend({
    defaults: {
      life: 100,
      x: 0,
      y: 0,
      angle:0
    }
  });

})();
