(function() {
  'use strict';

  sc.models.ChatLog = Backbone.Model.extend({
    initialize: function() {
      this.chats = new sc.collections.Chats();
    }
  });
  
})();
