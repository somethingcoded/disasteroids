(function() {
  'use strict';

  sc.views.WorldView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
    },

    template: _.template($('#world-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
    
  });
  
})();
