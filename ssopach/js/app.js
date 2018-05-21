(function () {
  'use strict';

  var coeffs = {
    widthToHeight: 2
  };
  var imgs = {
    hero: 'img/sprites/hero.png'
  };

  var newWidthToHeight = window.innerWidth / window.innerHeight;
  var newWidth = newWidthToHeight > coeffs.widthToHeight ? window.innerHeight * coeffs.widthToHeight : window.innerWidth;
  var lastWidth; // the last viewport width
  var lastHeight; // the last viewport height
  var CNV_WIDTH = newWidth; // canvas width

  var spaModel = new app.SPAModel();
  var spaView = new app.SPAView(CNV_WIDTH, coeffs);
  var spaController = new app.SPAController();

  //Play Game
  app.startGame = function () {

    //  Setup the canvas
    var canvas = document.getElementById('game-canvas');

    //  Create the game
    var game = new Game();
    game.gameId = game;

    //  Initialise it with the game canvas
    game.setup(canvas);

    //  Start the game
    game.start();

    //  Listen for keyboard events
    window.addEventListener('keydown', function keydown(e) {
      var keycode = e.which || window.event.keycode;
      //  Supress further processing of left/right/space (37/29/32)
      if (keycode === 37 || keycode === 39 || keycode === 32) {
        e.preventDefault();
      }
      game.keyDown(keycode);
    });
    window.addEventListener('keyup', function keydown(e) {
      var keycode = e.which || window.event.keycode;
      game.keyUp(keycode);
    });
  };

  spaModel.start(spaView);
  spaView.start(spaModel, document.body);
  spaController.start(spaModel, document.body);

}());
