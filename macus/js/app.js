'use strict';
(function() {
  let self = null;
  let idRAF = null;
  class GameManagement {
    constructor() {
      this.onChange = new app.Events(this);
      self = this;
    }
    /**
     * Starts method the 'updateView' on all models, starts a requestAnimationFrame.
     * @function
     */
    initGame() {
      for (let i = 0; i < bgLevelsSpeeds.length; i++) {
        bgLevels.models[i].updateView();
      }
      for (let j = 0; j < boxes.models.length; j++) {
        boxes.models[j].updateView();
      }
      for (let k = 0; k < crystals.models.length; k++) {
        crystals.models[k].updateView();
      }
      for (let n = 0; n < enemies.models.length; n++) {
        enemies.models[n].updateView();
      }

      ballModel.updateView();
      gameModel.updateView();
      idRAF = requestAnimationFrame(self.initGame);
    }
    /**
     * Sets the settings for the selected level
     * @function
     * @param {number} level - Selected level.
     */
    levelSettings(level) {
      switch (level) {
        case 1:
          sizesOfBoxes = [1, 2];
          vLocOfCrystals = [8, 9];
          boxesNumber = 5;
          enemiesNumber = 3;
          maxScore = 200;
          coeffs.widthToDistance = 3;
          gameLevel = 'magic_forest';
          coeffs.widthToGroundLevel = 2.19;
          break;
        case 2:
          sizesOfBoxes = [1, 1.5, 2, 2.5, 3];
          vLocOfCrystals = [3.5, 4.5, 5.5, 6.5];
          boxesNumber = 30;
          enemiesNumber = 10;
          maxScore = 1500;
          coeffs.widthToDistance = 10;
          gameLevel = 'field_castle';
          coeffs.widthToGroundLevel = 2.53;
          break;
      }
    }
    /**
     * Changes the canvas size when changing the viewport size and 
     * transfer to objects coeff of the change of the viewport size.
     * @function
     */
    resizeGame() {
      let gameArea = $('.canvas-wrap');
      let canvas = $('#game-canvas');
      let widthToHeight = 1.989637306;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      let newWidthToHeight = newWidth / newHeight;
      canvasWidth = newWidthToHeight > coeffs.widthToHeight ? window.innerHeight * coeffs.widthToHeight : window.innerWidth;
      if (gameArea.hasClass('canvas-wrap')) {
        $(gameArea).width(newWidth + 'px').height(newHeight + 'px');
        if (newWidthToHeight > widthToHeight) {
          newWidth = newHeight * widthToHeight;
        } else {
          newHeight = newWidth / widthToHeight;
        }

        $(canvas).attr({width: newWidth + 'px', height: newHeight + 'px'});
        $('.controls-wrap').css({
          'width': newWidth + 'px',
          'height': newHeight / 5 + 'px',
          'margin-left': -newWidth / 2 + 'px'
        });
        $('.btn-pause').css({
          'margin-left': $(canvas).offset().left + 'px',
          'margin-top': $(canvas).offset().top + 'px'
        });
        let aspectRatio = lastHeight / newHeight ? lastHeight / newHeight : 1;
        for (let i = 0; i < boxes.models.length; i++) {
          boxes.models[i].newSizes = aspectRatio;
        }
        for (let j = 0; j < crystals.models.length; j++) {
          crystals.models[j].newSizes = aspectRatio;
        }
        for (let k = 0; k < enemies.models.length; k++) {
          enemies.models[k].newSizes = aspectRatio;
        }
        for (let l = 0; l < bgLevelsSpeeds.length; l++) {
          bgLevels.models[l].newSizes = aspectRatio;
          bgLevels.views[l].newSizes = aspectRatio;
        }
        
        ballModel.newSizes = aspectRatio;
        ballView.newSizes = aspectRatio;
        gameModel.newSizes = aspectRatio;
        gameView.newSizes = aspectRatio;

        lastHeight = newHeight;
        lastWidth = newWidth;
      }
    }
    /**
     * The game starts. There are called the methods 'start' of the objects.
     * @function
     */
    startGame() {
      let canvas = document.getElementById('game-canvas');
      let canvasCtx = canvas.getContext('2d');
      createObjects();

      ballModel.start(ballView);
      ballView.start(ballModel, canvasCtx);
      ballController.start(ballModel);

      for (let i = 0; i < bgLevelsSpeeds.length; i++) {
        bgLevels.models[i].start(bgLevels.views[i]);
        bgLevels.views[i].start(bgLevels.models[i], canvasCtx);
      }
      for (let j = 0; j < boxes.models.length; j++) {
        boxes.models[j].start(boxes.views[j]);
        boxes.views[j].start(boxes.models[j], canvasCtx);
      }
      for (let k = 0; k < crystals.models.length; k++) {
        crystals.models[k].start(crystals.views[k]);
        crystals.views[k].start(crystals.models[k], canvasCtx);
      }
      for (let l = 0; l < enemies.models.length; l++) {
        enemies.models[l].start(enemies.views[l]);
        enemies.views[l].start(enemies.models[l], canvasCtx);
      }

      gameModel.start(gameView);
      gameView.start(gameModel, canvasCtx);
      
      this.initGame();
      this.resizeGame();
    }
    /**
     * Stops the game, requestAnimationFrame is canceled.
     * @function
     */
    stopGame() {
      cancelAnimationFrame(idRAF);
      boxes = {models: [], views: []};
      enemies = {models: [], views: []};
      crystals = {models: [], views: []};
      bgLevels = {models: [], views: []};
    }
    /**
     * Receive data from the observable.
     * @function
     */
    receiveData(context, data) {
      if (data.game === 'start') {
        this.levelSettings(data.level);
        this.startGame();
      } else if (data.game === 'stop') {
        this.stopGame();
      }
    }
  }

  let coeffs = {
    widthToHeight: 1.989637306, // ratio of width to height
    widthToGroundLevel: 2.53, // ratio of width to ground level
    widthToRadius: 31, // ratio of width to radius
    widthToMaxSpeedX: 160, // ratio of width to maximum speed along the X axis
    widthToAccelX: 19200, // ratio of width to acceleration along the X axis
    widthToCurrentSpeedY: 130, // ratio of width to current speed along the Y axis
    widthToMaxSpeedY: 130, // ratio of width to maximum speed along the Y axis
    widthToAccelY: 5000, // ratio of width to acceleration along the Y axis
    widthToPosX: 20, // ratio of width to position X
    widthToRightBorder: 2, // ratio of width to right border
    widthToAngleRotate: 14, // ratio of width to angle of rotation
    radiusToDecreaseRightBorder: 110, // ratio of the width to the amount of decrease in the shift of the ball
    widthToDistance: 10, // ratio of the width of the distance to the width of the viewport
    widthToSpeedEnemy: 1000 // ratio of width to speed enemy
  };
  let imgs = {
    ball: 'img/sprites/balls_set.png',
    boxes: 'img/sprites/boxes_set.png',
    crys: 'img/sprites/crystals_set.png',
    rays: 'img/rays.png',
    enemy: 'img/sprites/monsters_set.png',
    flag: 'img/game_indicators/finish.png',
    dist: 'img/game_indicators/distance.png',
    worm: 'img/game_indicators/worm.png',
    lifesWrap: 'img/game_indicators/life_wrap.png',
    lifesNum: 'img/game_indicators/life.png'
  };
  let newWidthToHeight = window.innerWidth / window.innerHeight; // ratio of width and height of the viewport
  let canvasWidth = newWidthToHeight > coeffs.widthToHeight ? window.innerHeight * coeffs.widthToHeight : window.innerWidth;
  let lastWidth; // the last viewport width
  let lastHeight; // the last viewport height
  let getRandomNumber = new app.Helper().getRandomNumber;
  let bgLevelsSpeeds = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1]; // speed of each background layer
  let sizesOfBoxes; // box sizes options
  let vLocOfCrystals; // crystal location height
  let boxesNumber; // number of generated boxes
  let enemiesNumber; // number of generated enemies
  let maxScore; // maximum number of points scored
  let gameLevel; // maximum number of points scored
  let boxes = {models: [], views: []};
  let enemies = {models: [], views: []};
  let crystals = {models: [], views: []};
  let bgLevels = {models: [], views: []};
  let ballModel;
  let ballView;
  let ballController;
  let gameModel;
  let gameView;
  let gameManagement = new GameManagement();
  let spaModel = new app.SPAModel();
  let spaView = new app.SPAView(canvasWidth, coeffs);
  let spaController = new app.SPAController();
  spaView.onChange.attach(gameManagement.receiveData.bind(gameManagement));
  spaView.onChange.attach(spaController.receiveData.bind(spaController));
  gameManagement.onChange.attach(spaController.receiveData.bind(spaController));
  /**
   * Generates and return an array of objects with settings for each box.
   * @function
   * @param {number} amount - Number of boxes to create.
   * @param {array} arrSizes - The array with the possible sizes for boxes.
   * @param {object} imgs - The object with paths to all images.
   */
  function generateBoxesOptions(amount, arrSizes, imgs) {
    let lengthSection = Math.floor(100 / amount);
    let options = [];
    let wayPoint;
    for (let i = 0; i < amount; i++) {
      let boxSize = arrSizes[getRandomNumber(0, arrSizes.length - 1)];
      if (amount <= 25) {
        do {
          wayPoint = getRandomNumber(i * lengthSection + 1, (i + 1) * lengthSection - 1);
        } while (wayPoint < 3);
      } else {
          wayPoint = getRandomNumber(i * lengthSection + 1, (i + 1) * lengthSection - 1); 
      }
      let obj = {
        width: boxSize, 
        height: boxSize, 
        distance: wayPoint, 
        img: imgs.boxes, 
        imgToCopy: [getRandomNumber(0, 2) * 250, getRandomNumber(0, 2) * 250, 250, 250]
      };
      options.push(obj);
    }
    return options;
  }
  /**
   * Generates and return an array of objects with settings for each crystal.
   * @function
   * @param {number} maxScore - The maximum score from all the collected crystals.
   * @param {array} arrLocations - An array with possible height for the location of the crystals.
   * @param {object} imgs - The object with paths to all images.
   */
  function generateCrystalsOptions(maxScore, arrLocations, imgs) {
    let x, y;
    let options = [];
    let valCrystals = [];
    let score = maxScore;
    do {
      let value = getRandomNumber(1, 6) * 10;
      valCrystals.push(value);
      score -= value;
    } while (score > 60);
    valCrystals.push(score);
    let lengthSection = 100 / valCrystals.length;
    for (let j = 0; j < valCrystals.length; j++) {
      switch (valCrystals[j]) {
        case 10:
          x = y = 0;
          break;
        case 20:
          x = 1; y = 0;
          break;
        case 30:
          x = 2; y = 0;
          break;
        case 40:
          x = 0; y = 1;
          break;
        case 50:
          x = y = 1;
          break;
        case 60:
          x = 2; y = 1;
          break;
      }
      let obj = {
        vLoc: arrLocations[getRandomNumber(0, arrLocations.length - 1)], 
        distance: getRandomNumber(j * lengthSection + 1, (j + 1) * lengthSection - 1), 
        imgMain: imgs.crys,
        val: valCrystals[j],
        imgBack: imgs.rays, 
        imgToCopy: [x * 100, y * 100, 100, 100]
      };
      options.push(obj);
    }
    return options;
  }
  /**
   * Generates and return an array of objects with settings for each enemy.
   * @function
   * @param {number} amount - Number of enemies to create.
   * @param {object} imgs - The object with paths to all images.
   * @param {array} boxesOptions - An array of objects with settings for each box.
   */
  function generateEnemiesOptions(amount, imgs, boxesOptions) {
    let wayPoints = [];
    let options = [];
    for (let k = 0; k < boxesOptions.length; k++) {
      wayPoints.push(boxesOptions[k].distance);
    }
    let lengthSection = (boxesOptions.length - 1) / amount;
    for (let n = 0; n < amount; n++) {
      let enemiesIndexes = getRandomNumber(n * lengthSection, (n + 1) * lengthSection - 1);
      let size = getRandomNumber(1, 2);
      let obj = {
        width: size,
        height: size,
        distance: (wayPoints[enemiesIndexes] + wayPoints[enemiesIndexes + 1]) / 2,
        leftX: wayPoints[enemiesIndexes],
        rightX: wayPoints[enemiesIndexes + 1],
        img: imgs.enemy,
        imgToCopy: [getRandomNumber(0, 3) * 256, getRandomNumber(0, 3) * 256, 256, 256],
        speed: getRandomNumber(1, 3) / 2,
        val: 100,
        widthPrevObj: boxesOptions[enemiesIndexes].width * (canvasWidth / coeffs.widthToRadius)
      };
      options.push(obj);
    }
    return options;
  }
  /**
   * Creates objects settings. 
   * Creates all objects. 
   * Some objects are added to the list of listeners of other objects.
   * @function
   */
  function createObjects() {
    let boxesOptions = generateBoxesOptions(boxesNumber, sizesOfBoxes, imgs);
    let crystalsOptions = generateCrystalsOptions(maxScore, vLocOfCrystals, imgs);
    let enemiesOptions = generateEnemiesOptions(enemiesNumber, imgs, boxesOptions);
    ballModel = new app.BallModel(canvasWidth, coeffs);
    ballView = new app.BallView(canvasWidth, imgs.ball, coeffs);
    ballController = new app.BallController();
    gameModel = new app.GameModel(canvasWidth, coeffs.widthToDistance, coeffs);
    gameView = new app.GameView(imgs, coeffs);
    ballModel.onChange.attach(spaModel.receiveData.bind(spaModel));
    ballModel.onChange.attach(gameModel.receiveData.bind(gameModel));
    gameModel.onChange.attach(ballModel.receiveData.bind(ballModel));
    gameModel.onChange.attach(ballController.receiveData.bind(ballController));
    gameModel.onChange.attach(spaController.receiveData.bind(spaController));
    gameModel.onChange.attach(spaModel.receiveData.bind(spaModel));
    gameModel.onChange.attach(spaView.receiveData.bind(spaView));
    gameModel.onChange.attach(gameManagement.receiveData.bind(gameManagement));

    for (let i = 0; i < boxesOptions.length; i++) {
      boxes.models[i] = new app.StaticBarrierModel(canvasWidth, boxesOptions[i], coeffs);
      boxes.views[i] = new app.StaticBarrierView(boxesOptions[i]);
      ballModel.onChange.attach(boxes.models[i].receiveData.bind(boxes.models[i]));
      boxes.models[i].onChange.attach(ballModel.receiveData.bind(ballModel));
    }
    for (let j = 0; j < crystalsOptions.length; j++) {
      crystals.models[j] = new app.ObjectForCollectModel(canvasWidth, crystalsOptions[j], coeffs);
      crystals.views[j] = new app.ObjectForCollectView(crystalsOptions[j]);
      ballModel.onChange.attach(crystals.models[j].receiveData.bind(crystals.models[j]));
      crystals.models[j].onChange.attach(ballModel.receiveData.bind(ballModel));
    }
    for (let k = 0; k < enemiesOptions.length; k++) {
      enemies.models[k] = new app.EnemyModel(canvasWidth, enemiesOptions[k], coeffs);
      enemies.views[k] = new app.EnemyView(enemiesOptions[k]);
      enemies.models[k].onChange.attach(ballModel.receiveData.bind(ballModel));
      ballModel.onChange.attach(enemies.models[k].receiveData.bind(enemies.models[k]));
      gameModel.onChange.attach(enemies.models[k].receiveData.bind(enemies.models[k]));
      spaController.onChange.attach(enemies.models[k].receiveData.bind(enemies.models[k]));
    }
    for (let l = 0; l < bgLevelsSpeeds.length; l++) {
      bgLevels.models[l] = new app.BackgroundModel(canvasWidth, bgLevelsSpeeds[l]);
      bgLevels.views[l] = new app.BackgroundView(canvasWidth, coeffs, 'img/game_bg_set/' + gameLevel + '/game_bg_' + (l + 1) + '.png');
      ballModel.onChange.attach(bgLevels.models[l].receiveData.bind(bgLevels.models[l]));
    }
  }

  spaModel.start(spaView);
  spaView.start(spaModel, document.body);
  spaController.start(spaModel, document.body);

  window.addEventListener('orientationchange', gameManagement.resizeGame);
  window.addEventListener('resize', gameManagement.resizeGame);
}());