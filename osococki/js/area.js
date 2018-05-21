'use strict';
class TArea {
  constructor(formID) {
    this.formID = formID;
    this._gameViewer = null;
    this._widthOfGame = null;
    this._heightOfGame = null;
    this._topOfGame = null;
    this._leftOfGame = null;
    this._blockWidth = null;
    this._blockHeight = null;
    this._hashWithCoords = [];//Матрица значений
    this._countOfCrashedWalls = 0;
  }
  static gameGridSize() {
    return [20, 15];
  }
  static countOfBlocks () {
    return 35;
  }
  preCalculate() {
    this.gameForm = this.formID;
    this._gameViewer.style.opacity = 0;
    this._gameViewer.className = 'show';
    this._widthOfGame = this._gameViewer.clientWidth;
    this._heightOfGame = this._gameViewer.clientHeight;
    this._topOfGame = Math.round(this.coords.top);
    this._leftOfGame = Math.round(this.coords.left);
    this._blockWidth = Math.round(this._widthOfGame / TArea.gameGridSize()[0]);
    this._blockHeight = Math.round(this._heightOfGame / TArea.gameGridSize()[1]);
    this._gameViewer.className = 'hide';
    this._gameViewer.style.opacity = 1;
  }
  createMarkup() {
    const xOffset = Math.floor((this.gameHeight % this.blockHeight) / 2);
    const yOffset = Math.floor((this.gameWidth % this.blockWidth) / 2);
    for (let y = 0; y < this.gameHeight; y = y + this.blockHeight) {
      let array = [];
      for (let x = 0; x < this.gameWidth; x = x + this.blockWidth) {
        //array.push((x + xOffset) + ' ' + (y + yOffset));
        array.push({'x': (x + xOffset), 'y': (y + yOffset), 'state': 'empty'});
      }
      this._hashWithCoords.push(array);
    }
  }
  createWalls() {
    const countOfBlocks = TArea.countOfBlocks();
    const divsContainer = document.createElement('div');
    divsContainer.className = "substrate";
    for (let i = 1; i <= countOfBlocks; i++) {
      let div = document.createElement('div');
      div.className = "wall";
      //тут выбираются координаты
      let row = Math.round(Math.random()*(14));
      let coll = Math.round(Math.random()*(19));
      let state = this.getBlockState(row, coll);
      let y;
      let x;
      if (state === 'empty') {
        let xy = this.getCoordsOfBlock(row, coll);
        y = xy[1];
        x = xy[0];
        this.writeBlockState(row, coll, 'wall');
      } else {
        i--;
        continue;
      }
      //
      div.style.top = y + 'px';
      div.style.left = x + 'px';
      div.style.width = this.blockWidth + 'px';
      div.style.height = this.blockHeight + 'px';
      divsContainer.appendChild(div);
    }
    this._gameViewer.appendChild(divsContainer);
  }
  set gameForm(formID) {
    this._gameViewer = document.getElementById(formID) || null;
  }
  get gameForm() {
    return this._gameViewer;
  }
  get coords() {
    let box = this._gameViewer.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
  get gameWidth() {
    return this._widthOfGame;
  }
  get gameHeight() {
    return this._heightOfGame;
  }
  get blockWidth () {
    return this._blockWidth;
  }
  get blockHeight () {
    return this._blockHeight;
  }
  get gameGridSize () {
    return TArea.gameGridSize();
  }
  get crashedWallsCount() {
    return this._countOfCrashedWalls;
  }
  getCoordsOfBlock(row, coll) {
    const coords = this._hashWithCoords[row][coll];
    let arrCords = [];
    arrCords[0] = coords.x;
    arrCords[1] = coords.y;
    return arrCords;
  }
  getBlockState(row, coll) {
    if (row < 0 || row > 14 || coll < 0 || coll > 19) {
      return 'edge';
    }
    let cell = this._hashWithCoords[row][coll];
    return cell.state;
  }
  writeBlockState (row, coll, state) {
    this._hashWithCoords[row][coll].state = state;
  }
  addCrashedWall () {
    this._countOfCrashedWalls++;
  }
}

// TODO: Possible move code bellow to the main.js
const area = new TArea('game');

function createGameField() {
  area.preCalculate();//Предрасчёт размеров и положения игровой формы, размеров объектов
  area.createMarkup();//Расчёт матрицы координат для соблюдения сетки игрового поля
  area.createWalls();//Создание стен на игровом поле
  console.log('Игровое поле построено..');
}
