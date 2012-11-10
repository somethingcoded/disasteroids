(function() {
  'use strict';
  
  var socket;
  window.socket = socket = io.connect();

  window.app = new sc.models.App();
  window.appView = new sc.views.AppView({model: window.app, el: $('.main')});
  window.appView.render();
  window.app.start();
  
})();
