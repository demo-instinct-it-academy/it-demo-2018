'use strict';
class TBomb {
  constructor(TAreaModel, TGamerModel, ID){
    this.formID = ID;
    this._DOMObject = null;
    this._width = null;
    this._height = null;
    this._gridPosition = null;
    this._coordsPosition = null;
    this._timer = 4000;
    this._gameFormModel = TAreaModel;
    this._gamerModel = TGamerModel;
    this._gridRadiusExploit = 1;
  }
  calculatePosition(row, coll){
    this._gridPosition = [row, coll];
    this._coordsPosition = this._gameFormModel.getCoordsOfBlock(row - 1, coll - 1);
    this._width = this._gameFormModel.blockWidth;
    this._height = this._gameFormModel.blockHeight;
  }
  plant() {
    const divForBomb = document.createElement('div');
    divForBomb.className = "bomb";
    divForBomb.style.top = this._coordsPosition[1] + 'px';
    divForBomb.style.left = this._coordsPosition[0] + 'px';
    divForBomb.style.width = this._width + 'px';
    divForBomb.style.height = this._height + 'px';
    divForBomb.id = this.formID;
    this._gameFormModel.gameForm.appendChild(divForBomb);
    this._DOMObject = document.getElementById(this.formID);
  }
  activateTimer() {
    /*тут используем стрелочную функцию, так как поменяется
     контекст this на window, если мы напрямую вызовем this.boom*/
    setTimeout(() => {
      this.boom();
    }
    , this._timer);
  }
  boom(){
    this._DOMObject.parentNode.removeChild(this._DOMObject);
    this.exploit(this.checkWhatAround());
    window._bombStatus = false;
  }
  checkWhatAround() {
    const bombRow = this._gridPosition[0];
    const bombColl = this._gridPosition[1];
    const arrayWithObjects = [];
    const objectsInGrid = [];
    if (this._gameFormModel.getBlockState(bombRow-1, bombColl-1) !== 'empty') {
      objectsInGrid.push([bombRow-1, bombColl-1]);
      arrayWithObjects.push(this._gameFormModel.getCoordsOfBlock(bombRow-1, bombColl-1));
    }
    for (let i = 1; i <= this._gridRadiusExploit; i++) {
      if (this._gameFormModel.getBlockState(bombRow-1-i, bombColl-1) !== 'empty' &&
        this._gameFormModel.getBlockState(bombRow-1-i, bombColl-1) !== 'edge') {
        objectsInGrid.push([bombRow-1-i, bombColl-1]);
        arrayWithObjects.push(this._gameFormModel.getCoordsOfBlock(bombRow-1-i, bombColl-1));
      }
      if (this._gameFormModel.getBlockState(bombRow-1, bombColl-1-i) !== 'empty' &&
        this._gameFormModel.getBlockState(bombRow-1, bombColl-1-i) !== 'edge') {
        objectsInGrid.push([bombRow-1, bombColl-1-i]);
        arrayWithObjects.push(this._gameFormModel.getCoordsOfBlock(bombRow-1, bombColl-1-i));
      }
      if (this._gameFormModel.getBlockState(bombRow-1+i, bombColl-1) !== 'empty' &&
        this._gameFormModel.getBlockState(bombRow-1+i, bombColl-1) !== 'edge') {
        objectsInGrid.push([bombRow-1+i, bombColl-1]);
        arrayWithObjects.push(this._gameFormModel.getCoordsOfBlock(bombRow-1+i, bombColl-1));
      }
      if (this._gameFormModel.getBlockState(bombRow-1, bombColl-1+i) !== 'empty' &&
        this._gameFormModel.getBlockState(bombRow-1, bombColl-1+i) !== 'edge') {
        objectsInGrid.push([bombRow-1, bombColl-1+i]);
        arrayWithObjects.push(this._gameFormModel.getCoordsOfBlock(bombRow-1, bombColl-1+i));
      }
    }

    return [arrayWithObjects, objectsInGrid];
  }
  exploit(array){
    const objects = array[0];
    const objectsInGrid = array[1];
    const allWalls = document.getElementsByClassName('substrate')[0];
    //проверим все полученные нами координаты с координатами объектов dom
    for (let i = 0; i < objects.length; i++) {
      let left = objects[i][0];
      let top = objects[i][1];
      let row = objectsInGrid[i][0];
      let coll = objectsInGrid[i][1];
      //проверим не убит ли игрок
      const gamer = this._gamerModel._gamerCoordsPosition;
      if (gamer[0] === left && gamer[1] === top) {
        this.killGamer();
      }
      //проверим блоки-стены
      let elems = allWalls.childNodes;
      elems = Array.prototype.slice.call(elems);
      elems.forEach((elem) => {
        if (elem.offsetLeft === left && elem.offsetTop === top) {
          this.crashWall(elem, row, coll);
        }
      });
    }
  }

  //TODO: change alert
  killGamer() {
    const gamerInDOM = this._gamerModel.gamer;
    const positionInGrid = this._gamerModel.positionGrid;
    this._gameFormModel.writeBlockState(positionInGrid[0]-1, positionInGrid[1]-1, 'empty');
    gamerInDOM.parentNode.removeChild(gamerInDOM);
    clearInterval(intervalID);//стоп таймер
    window._playNow = false;//игра остановлена
    window._winStatus = -1;//слив
    alert('You loose =(');//TODO:
    this._gamerModel.showScore();
  }

  //TODO: change alert
  crashWall(elem, row, coll) {
    this._gameFormModel.writeBlockState(row, coll, 'empty');
    elem.parentNode.removeChild(elem);
    this._gameFormModel.addCrashedWall();
    if (this._gameFormModel.crashedWallsCount === TArea.countOfBlocks()) {
      clearInterval(intervalID);//стоп таймер
      window._playNow = false;//игра остановлена
      window._winStatus = 1;//победа
      alert('You win!');//TODO:
      this._gamerModel.showScore();
    }
  }
}
const bomb = new TBomb(area, gamer, 'bomb');
function plantBomb(row, coll) {
  if (window._bombStatus === false) {
    window._bombStatus = true;
    bomb.calculatePosition(row, coll);
    bomb.plant();
    bomb.activateTimer();
  }
}
