(function() {
  'use strict';
  var socket;
  window.socket = socket = io.connect();

  window.world = new sc.models.World();
  window.worldView = new sc.views.WorldView({model: window.world});

  socket.on('sync', function(data) {
    window.world.start(data);
  });

})();
