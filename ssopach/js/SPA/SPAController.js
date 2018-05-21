(function (window) {
  'use strict';
  function SPAController() {
    var self = this;
    var myModel = null;
    var myField = null;
    self.onChange = new app.Events(self);
    var clickToBtn = function(e) {
      switch (e.target.className) {
        case 'lavel-1':
          myModel.switchToState({pagename: 'play'});
          myModel.vibrate(20);
          break;
        case 'btn-return':
          e.target.parentElement.parentElement.parentElement.classList.remove('show');
          self.onChange.notify({gameStatus: 'play'});
          myModel.vibrate(20);
          break;
        case 'btn-exit':
          var quit = confirm('Your current progress in the game will be lost! Leave anyway?');
          if (quit) {
            myModel.switchToState({pagename: 'main'});
            myModel.vibrate(20);
          } else {
            e.target.parentElement.parentElement.parentElement.classList.remove('show');
          }
          break;
        case 'btn-back':
          myModel.switchToState({pagename: 'main'});
          myModel.vibrate(20);
          break;
        case 'btn-pause':
          e.target.nextElementSibling.classList.add('show');
          self.onChange.notify({gameStatus: 'pause'});
          myModel.vibrate(20);
          break;
        case 'see-btn play':
          myModel.switchToState({pagename: 'play'});
          myModel.vibrate(20);
          break;
        case 'see-btn records':
          myModel.switchToState({pagename: 'records'});
          myModel.vibrate(20);
          break; 
        case 'see-btn about':
          myModel.switchToState({pagename: 'about'});
          myModel.vibrate(20);
          break; 
      }
    };
    self.start = function(model, field) {
      myModel = model;
      myField = field;
      window.addEventListener('load',myModel.readFromStorage);
      window.addEventListener('hashchange', myModel.switchToStateFromURLHash);
      window.addEventListener('load', myModel.switchToStartPage);
      myField.addEventListener('click', clickToBtn);
      window.onbeforeunload = function(e) {
        e.returnValue = 'Your current progress in the game will be lost!';
      };
    };
  }

  window.app = window.app || {};
  window.app.SPAController = SPAController;
})(window);