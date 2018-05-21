function init() {

  const canvasWrapper = document.getElementById('canvasWrapper');
  const stage = new createjs.Stage(canvasWrapper);

  let androids = [];
  let lasers = [];
  let androidLasers = [];
  let timeoutsOfTheGame = [];
  let status = 'PLAY';
  let playerScore = 0;

  const rocket = new createjs.Bitmap('img/aim-rocket-128.png');
  rocket.scaleX = .4;
  rocket.scaleY = .4;
  rocket.x = 265;
  rocket.y = 490;
  stage.addChild(rocket);

  const score = new createjs.Text('Current Score: ' + playerScore, '20px Arial', '#a1dae6');
  score.x = 20;
  score.y = 25;
  score.textBaseline = 'alphabetic';
  stage.addChild(score);

  stage.update(); //ОБНОВЛЕНИЯ СОБЫТИЙ ИГРОВОГО ПОЛЯ НА ОСНОВАНИИ КЛАССА БИБЛИОТЕКИ

  //ПЕРЕМЕННЫЕ ПО УПРАВЛЕНИЮ ИГРОЙ
  const SPACE = 32; //СТРЕЛЯТЬ
  const KEYCODE_LEFT = 37; //ДВИЖЕНИЕ ВЛЕВО
  const KEYCODE_RIGHT = 39; //ДВИЖЕНИЕ ВПРАВО

  function keyPush(push) {
    switch(push.keyCode) {
      case KEYCODE_RIGHT:
        if (rocket.x + 55 <= canvasWrapper.width) {
          rocket.x += 7;
        }
        break;

      case KEYCODE_LEFT:
        if (rocket.x > 0) {
          rocket.x -= 7;
        }
        break;

      case SPACE:
        addLaser(rocket.x + 60);
        break;
    }
    stage.update(); //ОБНОВЛЕНИЕ ИГРОВОГО ПОЛЯ (ТАК В КАЖДОЙ ПОСЛЕДУЮЩЕЙ СУЩНОСТИ)
  }

  //СОЗДАНИЕ ЛАЗЕРА
  function addLaser(x) {
    let laser = new createjs.Shape(); //СОЗДАНИЕ ОБЪЕКТА ЛАЗЕР
    laser.graphics.beginFill('#8cb7eb').drawCircle(-34, 7, 7); //РИСОВАНИЕ ЛАЗЕРА И ВЫЧИСЛЕНИЕ ЕГО ПОЗИЦИИ ОТНОСИТЕЛЬНО РАКЕТЫ ПО ОСИ X
    laser.x = x;
    laser.y = 460; //ПОЗИЦИЯ ЛАЗЕРА ПО ОСИ Y
    stage.addChild(laser);
    lasers.push(laser);
    laserMove(laser);
  }

  //АНИМИРОВАНИЕ ЛАЗЕРА ИЗ РАКЕТЫ
  function laserMove(laser) {
    timeoutsOfTheGame.push(
        setTimeout(function () {
          laser.y -= 12; //СКОРОСТЬ ЛАЗЕРА
          stage.update();

          if (laser.y > -20) {
            for (let i = 0; i < androids.length; i++) {
              let pos = laser.localToLocal(androids[i]);
              if (androids[i].hitTest(pos.x, pos.y)) {
                playerScore += 10;
                score.text = 'Score: ' + playerScore;
                stage.update();

                status = 'WIN';
                pauseGame();
                removeHidden('win');
                addHidden('pause');
              }
            }
            laserMove(laser);
          }
        }, 20)) //ПОДБОР ЗАДЕРЖКИ ЛАЗЕРА по таймеру
  }

  //ANDROIDS
  function setAndroids() {
    let x = 50;
    let y = 50;
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 7; b++) {
        let android = new createjs.Bitmap('img/droid.png');
        android.x = x;
        android.y = y;
        android.scaleX = .1;
        android.scaleY = .1;
        timeoutsOfTheGame.push(android);
        stage.addChild(android);
        stayAndroid(android);
        x += 75;
      }
      x = 50;
      y += 70;
    }
    stage.update();
  }

  function stayAndroid(android) {
    timeoutsOfTheGame.push(
        setTimeout(function () {
          for (let i = 0; i < androids.length; i++) {

            if (androids[i].x + 10 + 50 < 600) {
                androids[i].x += 10;

            } else if (androids[i].y < 800) {
              androids[i].x = 20;
              androids[i].y += 100;
            }

            if (Math.random() < .5) {
              androidLaser(androids[i]);
            }

            let pos = androids[i].localToLocal(0, 0, rocket);
            if (rocket.hitTest(pos.x, pos.y)) {
              status = 'LOST';
              pauseGame();
              removeHidden('lost');
              addHidden('pause');
            }
          }

          if (status === 'PLAY') {
            stage.update();

            stayAndroid(android);
          }
        }, 2000));
  }

  //Лазер андроидов
  function androidLaser (android) {
    let laser = new createjs.Shape();
    laser.graphics.beginFill('Green').drawRect(0, 0, 5, 20);
    laser.x = android.x;
    laser.y = android.y;
    stage.addChild(laser);
    androidLasers.push(laser);
    droidLaser(laser);
  }

  function droidLaser(laser) {
    timeoutsOfTheGame.push (
        setTimeout(function () {
          laser.y += 10;
          stage.update();

          if (laser.y < canvasWrapper.height + 20) {
            let pos = laser.localToLocal(0, 0, rocket);
            if (rocket.hitTest(pos.x, pos.y)) {
              status = 'LOST';
              pauseGame();
              removeHidden('lost');
              addHidden('pause');
            }
            if (status === 'PLAY') {
              droidLaser(laser);
            }
          }
        }, 50))
  }

  //TOOLS of the GAME

  function pauseGame() {
    if (timeoutsOfTheGame) {
      for (let i = 0; i < timeoutsOfTheGame.length; i++) {
        clearTimeout(timeoutsOfTheGame[i]);
      }
    }
    timeoutsOfTheGame = [];
  }

  function restartGame() {
    if (androids) {
      for (let i = 0; i < androids.length; i++) {
        stayAndroid(androids[i]);
      }
    }

    if (lasers) {
      for (let i = 0; i < lasers.length; i++) {
        stayAndroid(lasers[i]);
      }
    }

    if (androidLasers) {
      for (let i = 0; i < androidLasers.length; i++) {
        droidLaser(androidLasers[i]);
      }
    }
  }

  function pushPause() {
    if (document.getElementById('pause').className === 'hide') {
      document.getElementById('resume').className = 'hide';
      document.getElementById('pause').className = '';
      restartGame();
    } else {
      document.getElementById('pause').className = 'hide';
      document.getElementById('resume').className = '';
      pauseGame();
    }
  }

  function addHidden() {
    document.getElementById('start').className += ' hide'; //БЕЗ ES6
  }

  function removeHidden(id) {
    let classes = document.getElementById(`${id}`).className.split(' '); //ПРИМЕНЕН ES6
    classes.splice(classes.length - 1, 1);
    document.getElementById(`${id}`).className = classes.join(' '); //ПРИМЕНЕН ES6
  }

  function startGame() {
    setAndroids();
    addHidden('start');
    removeHidden('pause');
  }

  function resetGame() {
    if (androids) {
      for (let i = 0; i < androids.length; i++) {
        stage.removeChild(androids[i]);
      }
    }

    if (lasers) {
      for (let i = 0; i < lasers.length; i++) {
        stage.removeChild(lasers[i]);
      }
    }

    if (androidLasers) {
      for (let i = 0; i < androidLasers.length; i++) {
        stage.removeChild(androidLasers[i]);
      }
    }

    androids = [];
    lasers = [];
    androidLasers = [];
    timeoutsOfTheGame = [];
    status = 'PLAY';
    playerScore = 0;
    score.text = 'Score: ' + playerScore;
    addHidden('lost');
    removeHidden('pause');
    setAndroids();
  }

  function continueGame() {
    if (lasers) {
      for (let i = 0; i < lasers.length; i++) {
        stage.removeChild(lasers[i]);
      }
    }

    androids = [];
    lasers = [];
    timeoutsOfTheGame = [];
    status = 'PLAY';
    addHidden('win');
    removeHidden('pause');
    setAndroids();
  }

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('resetBtn').addEventListener('click', resetGame);
  document.getElementById('continueBtn').addEventListener('click', continueGame);
  document.getElementById('pause').addEventListener('click', pushPause);
  document.getElementById('resume').addEventListener('click', pushPause);

  document.onkeydown = keyPush;
}