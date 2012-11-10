(function() {
  'use strict';
  sc.models.Asteroid = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
      life: 100,
      radius: 5,
      x:0,
      y:0
    }
  });
})();
