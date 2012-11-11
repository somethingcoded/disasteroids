(function() {
  
  sc.views.StatsView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.model.on('change:kills change:deaths change:suicides', this.render);
    },

    className: 'stats',

    template: _.template($('#stats-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
})();
