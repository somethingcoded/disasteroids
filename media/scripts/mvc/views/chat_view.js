(function() {
  'use strict';

  sc.views.ChatView = Backbone.View.extend({
    template: _.template($('#chat-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
})();
