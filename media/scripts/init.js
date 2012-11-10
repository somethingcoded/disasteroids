(function() {
  'use strict';
  var socket;
  window.socket = socket = io.connect();

  window.world = new sc.models.World();
  window.worldView = new sc.views.WorldView({model: window.world, el: $('.main')});
  window.worldView.render();

  socket.on('sync', function(data) {
    window.world.start(data);
  });

})();
