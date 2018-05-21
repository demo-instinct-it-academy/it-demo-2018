(function (window) {
  'use strict';
  function SPAView(widthArea, coeffs) {
    var self = this;
    var myModel = null;
    var myField = null;
    var heightArea = widthArea / coeffs.widthToHeight;
    var renderPage = function() {
      if (myModel.SPAState.pagename) {
        switch (myModel.SPAState.pagename) {
          case 'main':
            myField.textContent = '';
            myField.appendChild(createMenu(myModel.menuBtnCls));
            myModel.switchToState({pagename: 'main'});
            break;
          case 'play':
            myField.textContent = '';
            myField.appendChild(createGameArea());
            myModel.switchToState({pagename: 'play'});
            window.app.startGame();
            break;
          case 'records':
            myField.textContent = '';
            myField.appendChild(createRecords(myModel.getStorage()));
            myModel.switchToState({pagename: 'records'});
            break;
          case 'about':
            myField.textContent = '';
            myField.appendChild(createAbout(myModel.text));
            myModel.switchToState({pagename: 'about'});
            break;
          default:
            myModel.switchToState({pagename: 'main'});
        }
      }
    };
    var createMenuWireframe = function() {
      var logo = document.createElement('div');
      var menuWrap = document.createElement('div');
      var caption = document.createElement('div');
      var menu = document.createElement('div');
      menuWrap.className = 'menu-wrap';
      menu.className = 'menu';
      logo.className = 'logo';
      caption.className = 'menu-caption';
      menuWrap.appendChild(logo);
      menu.appendChild(caption);
      menuWrap.appendChild(menu);
      return menuWrap;
    };
    var createGameArea = function() {
      var canvasWrap = document.createElement('div');
      var canvas = document.createElement('canvas');
      var pauseBtn = document.createElement('div');
      var controlsWrap = document.createElement('div');
      var ctrlBtnFire = document.createElement('div');
      var ctrlBtnMoveWrap = document.createElement('div');
      var ctrlBtnMoveLeft = document.createElement('div');
      var ctrlBtnMoveRight = document.createElement('div');
      canvas.id = 'game-canvas';
      canvas.width = widthArea;
      canvas.height = heightArea;
      pauseBtn.className = 'btn-pause';
      canvasWrap.className = 'canvas-wrap';
      controlsWrap.className = 'controls-wrap';
      ctrlBtnFire.className = 'btn-tap-fire';
      ctrlBtnMoveWrap.className = 'ctrl-btn-move-wrap';
      ctrlBtnMoveLeft.className = 'btn-tap-left btn-tap';
      ctrlBtnMoveRight.className = 'btn-tap-right btn-tap';
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(pauseBtn);
      canvasWrap.appendChild(createPauseMenu());
      canvasWrap.appendChild(controlsWrap);
      controlsWrap.appendChild(ctrlBtnMoveWrap);
      controlsWrap.appendChild(ctrlBtnFire);
      ctrlBtnMoveWrap.appendChild(ctrlBtnMoveLeft);
      ctrlBtnMoveWrap.appendChild(ctrlBtnMoveRight);
      return canvasWrap;
    };
    var createMenu = function(menuBtnCls) {
      var menuWrap = createMenuWireframe();
      var ul = document.createElement('ul');
      for (var i = 0; i < menuBtnCls.length; i++) {
        var li = document.createElement('li');
        li.className = 'see-btn ' + menuBtnCls[i];
        li.innerText = menuBtnCls[i];
        ul.appendChild(li);
      }
      menuWrap.querySelector('.menu').classList.add('menu-main');
      menuWrap.querySelector('.menu').appendChild(ul);
      menuWrap.querySelector('.menu-caption').innerText = 'menu';
      return menuWrap;
    };
    var createRecords = function(arr) {
      var menuWrap = createMenuWireframe();
      var arrow = document.createElement('div');
      var ul = document.createElement('ul');
      if (arr.records) {
        var num = arr.records.length < 8 ? arr.records.length : 8;
        arr.records.sort(function(a, b) {return b.score - a.score;});
        for (var i = 0; i < num; i++) {
          var li = document.createElement('li');
          var text = arr.records[i].name + ' : ' + arr.records[i].score;
          li.textContent = text;
          ul.appendChild(li);
        }
      }
      arrow.className = 'btn-back';
      menuWrap.querySelector('.menu').appendChild(ul);
      menuWrap.querySelector('.menu').appendChild(arrow);
      menuWrap.querySelector('.menu').classList.add('menu-records');
      menuWrap.querySelector('.menu-caption').innerText = 'records';
      return menuWrap;
    };
    var createAbout = function() {
      var menuWrap = createMenuWireframe();
      var arrow = document.createElement('div');
      var textArea = document.createElement('p');
      textArea.innerHTML = 'The game developed by S. Sopach';
      arrow.className = 'btn-back';
      menuWrap.querySelector('.menu').classList.add('menu-about');
      menuWrap.querySelector('.menu').appendChild(textArea);
      menuWrap.querySelector('.menu').appendChild(arrow);
      menuWrap.querySelector('.menu-caption').innerText = 'about';
      return menuWrap;
    };
    var createPauseMenu = function() {
      var pauseMenuOuter = document.createElement('div');
      var pauseMenuInner = document.createElement('div');
      var pauseMenu = document.createElement('div');
      var pauseMenuCaption = document.createElement('div');
      var returnBtn = document.createElement('div');
      var exitToMenu = document.createElement('div');
      pauseMenuOuter.className = 'pause-menu-outer';
      pauseMenuInner.className = 'pause-menu-inner';
      pauseMenuCaption.className = 'pause-menu-caption';
      pauseMenuCaption.innerText = 'Submenu';
      pauseMenu.className = 'pause-menu';
      returnBtn.className = 'btn-return';
      exitToMenu.className = 'btn-exit';
      pauseMenu.appendChild(returnBtn);
      pauseMenu.appendChild(exitToMenu);
      pauseMenuInner.appendChild(pauseMenuCaption);
      pauseMenuInner.appendChild(pauseMenu);
      pauseMenuOuter.appendChild(pauseMenuInner);
      return pauseMenuOuter;
    };

    self.start = function(model, field) {
      myModel = model;
      myField = field;
    };
    self.update = function() {
      renderPage();
    };
  }

  window.app = window.app || {};
  window.app.SPAView = SPAView;
})(window);