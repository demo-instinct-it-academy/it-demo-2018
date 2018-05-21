'use strict';
class TGamer {
  constructor (gameFormModel, formID){
    this.formID = formID;
    this._gamerWidth = null;
    this._gamerHeight = null;
    this._gamerGridPosition = null;
    this._gamerCoordsPosition = null;
    this._gamerSpeed = 0;
    this._gameFormModel = gameFormModel;
    this._gameGridSize = this._gameFormModel.gameGridSize;
  }
  preCalculate () {
    this._gamerGridPosition = [1, 1];
    this._gamerCoordsPosition = this._gameFormModel.getCoordsOfBlock(this._gamerGridPosition[1] - 1,
      this._gamerGridPosition[0] - 1);
    this._gamerWidth = this._gameFormModel.blockWidth;
    this._gamerHeight = this._gameFormModel.blockHeight;
  }
  draw () {
    const divForGamer = document.createElement('div');
    divForGamer.className = "gamer";
    divForGamer.style.top = this._gamerCoordsPosition[1] + 'px';
    divForGamer.style.left = this._gamerCoordsPosition[0] + 'px';
    divForGamer.style.width = this._gamerWidth + 'px';
    divForGamer.style.height = this._gamerHeight + 'px';
    divForGamer.id = this.formID;
    this._gameFormModel.gameForm.appendChild(divForGamer);
    this._gameFormModel.writeBlockState(this._gamerGridPosition[0]-1, this._gamerGridPosition[1]-1, 'gamer');
  }
  addGamerControlsListeners() {
    const self = this;
    window.addEventListener( "keydown" , self.onKeyDown, true);
    window.addEventListener( "keyup" , self.onKeyUp, true);
    window.addEventListener("keydown", stopDefAction);
  }

  //TODO: self = gamer; fix it
  onKeyDown(event) {
    self = gamer;//TODO:
    switch (event.keyCode) {
      case 13:
        if (window._playNow === false && window._winStatus === 0) {
          window._playNow = true;
          document.getElementById('spinner').className = 'hide';
          document.getElementById('press-enter').className = 'hide';
          self.timer('on');
        } else {
          if (window._playNow === true && window._winStatus === 0) {
            window._playNow = false;
            document.getElementById('spinner').className = 'show';
            document.getElementById('press-enter').getElementsByTagName('span')[0].textContent = 'continue';
            document.getElementById('press-enter').className = 'show';
            self.timer('pause');
          }
        }
        if (window._winStatus !== 0) {
          const result = confirm('Сохранить ваш результат?');
          if (result === true) {
            const resultForm = document.getElementById('result');
            resultForm.className = 'show';
            document.getElementById('score').value =
              self._gameFormModel.crashedWallsCount;
          } else {
            location.reload();
          }
        }
        break;
      default:
        break;
    }
    if (window._playNow === true) {
      switch (event.keyCode) {
        case 37:
          self.upOtherKeys();
          console.log('Клавиша Влево нажата');
          continueMove = true;
          self.moveGamer('left');
          flag['_37'] = true;
          break;
        case 38:
          self.upOtherKeys();
          console.log('Клавиша Вверх нажата');
          continueMove = true;
          self.moveGamer('up');
          flag['_38'] = true;
          break;
        case 39:
          self.upOtherKeys();
          console.log('Клавиша Вправо нажата');
          continueMove = true;
          self.moveGamer('right');
          flag['_39'] = true;
          break;
        case 40:
          self.upOtherKeys();
          console.log('Клавиша Вниз нажата');
          continueMove = true;
          self.moveGamer('down');
          flag['_40'] = true;
          break;
        case 32:
          const currentPosition = gamer.positionGrid;
          plantBomb(currentPosition[0], currentPosition[1]);
          break;
        default:
          break;
      }
      window.removeEventListener( "keydown" , self.onKeyDown, true);
    }
  }

  onKeyUp(event) {
    self = gamer;//TODO:
    switch (event.keyCode) {
      case 37:
        if (flag['_37'] === true) {
          console.log('Клавиша Влево отпущена');
          flag['_37'] = false;
        }
        break;
      case 38:
        if (flag['_38'] === true) {
          console.log('Клавиша Вверх отпущена');
          flag['_38'] = false;
        }
        break;
      case 39:
        if (flag['_39'] === true) {
          console.log('Клавиша Вправо отпущена');
          flag['_39'] = false;
        }
        break;
      case 40:
        if (flag['_40'] === true) {
          console.log('Клавиша Вниз отпущена');
          flag['_40'] = false;
        }
        break;
      default:
        break;
    }
    continueMove = false;
    window.addEventListener("keydown", self.onKeyDown, true);
  }
  upOtherKeys() {
    for (let key in flag) {
      if (flag[key] === true) {
        this.onKeyUp({
          keyCode: Number(key.substr(1))
        });
        flag[key] = false;
      }
    }
  }

  //TODO: change alert
  timer(arg) {
    if (arg === 'on') {
      let timer = document.getElementsByClassName('timer')[0].getElementsByTagName('span')[0];
      intervalID = setInterval(() => {
        timer.textContent = Number(timer.textContent) - 1;
        if (Number(timer.textContent) === 0) {
          clearInterval(intervalID);
          //TODO: действие по окончанию таймера
          window._playNow = false;//игра остановлена
          if (this._gameFormModel.crashedWallsCount - TArea.countOfBlocks() === 0) {
            window._winStatus = 1;
            alert('You win!');//TODO:
            this.showScore();
          } else {
            window._winStatus = -1;
            alert('You loose =(');//TODO:
            this.showScore();
          }
        }
      }, 1000);
    }
    if (arg === 'pause') {
      clearInterval(intervalID);
    }
  }

  newPosition(row, coll) {
    this._gameFormModel.writeBlockState(this._gamerGridPosition[0]-1, this._gamerGridPosition[1]-1, 'empty');
    this._gamerGridPosition = [row+1, coll+1];
    this._gamerCoordsPosition = this._gameFormModel.getCoordsOfBlock(row, coll);
    this._gameFormModel.writeBlockState(this._gamerGridPosition[0]-1, this._gamerGridPosition[1]-1, 'gamer');
  }
  moveGamer(direction) {
    lastDirection = direction;
    let speedCoef; // [x, y] - coefficient of direction for left and top
    switch (direction)
    {
      case 'left':
        speedCoef = [-1, 0];
        break;
      case 'up':
        speedCoef = [0, -1];
        break;
      case 'right':
        speedCoef = [1, 0];
        break;
      case 'down':
        speedCoef = [0, 1];
        break;
    }
    const elem = this.gamer;
    const gamerPos = this.positionGrid;
    const nextCellRow = joinCells(gamerPos[0]-1, speedCoef[1]);
    const nextCellColl = joinCells(gamerPos[1]-1, speedCoef[0]);
    if (this._gameFormModel.getBlockState(nextCellRow, nextCellColl) === 'empty') {
      if (animationDoing === false && continueMove === true) {
        animationDoing = true;
        this.moveNextCell(elem, nextCellRow, nextCellColl);
      }
    }
  }
  moveNextCell(elem, row, coll) {
    const coords = this._gameFormModel.getCoordsOfBlock(row, coll);
    const currentGrid = this.positionGrid;
    const currentCoords = this._gameFormModel.getCoordsOfBlock(currentGrid[0]-1, currentGrid[1]-1);
    this.animate({
      self: this,
      duration: 600,
      timing: function(timeFraction) {
        return timeFraction;
      },
      draw: function(progress) {
        elem.style.left = currentCoords[0] + (progress * (coords[0] - currentCoords[0])) + 'px';
        elem.style.top = currentCoords[1] + (progress * (coords[1] - currentCoords[1])) + 'px';
        if (progress === 1) {
          animationDoing = false;
        }
        if (progress === 1 && continueMove === true) {
          self.moveGamer(lastDirection);
        }
      }
    });
    this.newPosition(row, coll);
  }
  animate(options) {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction от 0 до 1
      let timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;
      // текущее состояние анимации
      const progress = options.timing(timeFraction)
      options.draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }
  showScore() {
    window.removeEventListener("keydown", stopDefAction);
    document.getElementById('press-enter').getElementsByTagName('span')[0].textContent = 'action';
    document.getElementById('press-enter').className = 'show';
    alert('Your score ' + this._gameFormModel.crashedWallsCount + ' crashed blocks!');//TODO:
  }
  get positionGrid() {
    return this._gamerGridPosition;
  }

  //TODO: refactor to gamerInDOM
  get gamer() {
    return document.querySelector('#gamer');
  }
}

// TODO: Possible move code bellow to the main.js
const gamer = new TGamer(area, 'gamer');
let flag = {
  '_37': false,
  '_38': false,
  '_39': false,
  '_40': false
};
let continueMove = false;
let animationDoing = false;
let lastDirection;
let intervalID;/*variable for saving setinterval ID*/
function createGamer() {
  gamer.preCalculate();
  gamer.draw();
  gamer.addGamerControlsListeners();
}

//TODO: move to app
function stopDefAction(evt) {
  evt.preventDefault();
}
function joinCells(a, b) {
  return a + b;
}
