(function() {
  
  sc.views.Stats = Backbone.View.extend({
    initialize: function() {
      _.bindAll();
    },

    template: _.template($('#stats').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
})();
