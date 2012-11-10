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
    }
  });

})();
