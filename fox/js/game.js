'use strict';

class Game {
  constructor () {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this._rafId = null;
    this.gameState = 'ready'; // available states: stopped, ready, running
    this.minusLife = false;
    this.canvas.width = 600;
    this.canvas.height = 700;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.score = 0;
    this.sprites = {
      paddle: null,
      background: null,
      brickYellow: null,
      brickGreen: null,
      brickRed: null,
      brickGrey: null,
      ball: null
    };
    this.sounds = {
      snd1: null,
      snd2: null,
      snd3: null,
      snd4: null,
    };
    this.bricks = [];
    this.level = 1;
    this.lives = 3;
    this.resultsStorageURL = 'M_LIS_ARCANOID1';
    this.results = new ResultsStorage(this.resultsStorageURL);
  }
  init (){
    const begin = document.getElementById('start');
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    this.ctx.font = '20px Helvetica';
    this.ctx.fillStyle = '#ff383a';
    this.paddle = new Paddle({width: this.width, height: this.height});
    this.paddle.init();
    this.ball = new Ball({width: this.width, height: this.height, paddleHeight: this.paddle.height});
    this.ball.init();
    window.addEventListener('keydown', e => {this.keydownListener(e)});
    window.addEventListener('keyup', e => this.keyupListener(e));
    begin.addEventListener('click', () => this.softStart());
    left.addEventListener('touchstart', e => this.softLeft());
    left.addEventListener('touchend', () => this.softStop());
    right.addEventListener('touchstart', e => this.softRight());
    right.addEventListener('touchend', () => this.softStop());
  }
  keydownListener(e){
    e = window.event || e;
    if ( e.keyCode === 32 ) {
      switch(this.gameState) {
        case 'stopped': 
          if (this.isWin() ) {
            // it means you won
            this.createLevel();
          } else if (this.minusLife && this.lives > 0) {
            this.minusLife = false;
          }
          this.ball.init();
          this.paddle.init();
          this.gameState = 'ready';
          this.run();
          break;
        case 'ready': 
        case 'running':
          if(this.ball.sticky) {
            this.ball.sticky = false;
            this.releaseBall();
          }
          break;
      }
    } else if ( e.keyCode === 37 ) {
      this.paddle.dx = -this.paddle.velocity;
      if (this.ball.sticky) {
        this.ball.dx = -this.paddle.velocity;
      }
    } else if ( e.keyCode === 39 ) {
      this.paddle.dx = this.paddle.velocity;
      if (this.ball.sticky) {
        this.ball.dx = this.paddle.velocity;
      }
    }
  }
  keyupListener (){
    this.paddle.stop();
    if (this.ball.sticky) {
      this.ball.stop();
    }
  }
  softStart (){
    switch(this.gameState) {
      case 'stopped':
        if (this.isWin()) {
          // it means you won
          this.createLevel();
        } else if (this.minusLife && this.lives > 0) {
          this.minusLife = false;
        }
        this.ball.init();
        this.paddle.init();
        this.gameState = 'ready';
        this.run();
        break;
      case 'ready':
      case 'running':
        if(this.ball.sticky) {
          this.ball.sticky = false;
          this.releaseBall();
        }
        break;
    }
  }
  softLeft(e){
    e = window.event || e;
    e.preventDefault();
    this.paddle.dx = -this.paddle.velocity;
    if (this.ball.sticky) {
      this.ball.dx = -this.paddle.velocity;
    }
  }
  softRight(e){
    e = window.event || e;
    e.preventDefault();
    this.paddle.dx = this.paddle.velocity;
    if (this.ball.sticky) {
      this.ball.dx = this.paddle.velocity;
    }
  }
  softStop(){
    this.paddle.stop();
    if (this.ball.sticky) {
      this.ball.stop();
    }
  }
  preload(){
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = './imgs/' + key + '.png';
    }
    for (let key in this.sounds) {
      this.sounds[key] = new Audio();
      this.sounds[key].src = './sounds/' + key + '.wav';
      this.sounds[key].volume = 0.5;
    }
  }
  createLevel(){
    this.gameState = 'ready';
    const levelDefinition = CONFIG.levels[this.level - 1] || null;
    
    if(!levelDefinition) {
      throw new Error('No such level');
    }
    this.bricks = [];
    for (let row = 0; row < levelDefinition.length; row++) {
      for (let col = 0; col < levelDefinition[row].length; col++) {
        const strength = levelDefinition[row][col];
        
        this.bricks.push({
          strength,
          x: 74 * col + 10,
          y: 40 * row + 40,
          width: 64,
          height: 32,
        });
      }
    }
  }
  update(){
    if (this.collide(this.paddle)) {
      this.bumpPaddle(this.paddle);
    }
    if (this.ball.dx || this.ball.dy) {
      this.ball.move();
    }
    if (this.paddle.dx) {
      this.paddle.move();
    }
    this.bricks.forEach(element => {
      if (element.strength !== 0) {
        if (this.collide(element)) {
          this.bumpBlock(element);
        }
      }
    });
    this.checkBounds();
  }
  render(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(
      this.sprites.ball,
      this.ball.width * this.ball.frame, 0,
      this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    this.ctx.drawImage(this.sprites.paddle, this.paddle.x, this.paddle.y);
    this.bricks.forEach(element => {
      if (element.strength !== 0) {
        this.ctx.drawImage(this.sprites[`brick${CONFIG.brickColorMap[element.strength] || 'Yellow'}`], element.x, element.y);
      }
    });
    this.ctx.fillText('Score: ' + this.score, 5, this.height - 680);
    this.ctx.fillText('Lives: ' + this.lives, 520, this.height - 680);
    if (this.isWin()) {
      this.ctx.fillText("YOU WIN!!!", this.width / 2 - 35, this.height / 2);
      this.ctx.fillText("For the next level press SPACE", this.width / 2 - 120, this.height / 2 + 40);
    } else if (this.minusLife) {
      this.ctx.fillText("Press 'SPACE' to continue", this.width / 2 - 110, this.height / 2 + 20);
    } else if (this.lives < 1) {
      this.ctx.fillText("GAME OVER", this.width / 2 - 55, this.height / 2);
    }
  }
  run(){
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    this.update();
    this.render();
    if(this._rafId) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this.gameState !== 'stopped') {
      this._rafId = window.requestAnimationFrame(() => {
        this.run();
      });
    }
  }
  start(){
    this.init();
    this.preload();
    this.createLevel();
    this.run();
  }
  releaseBall(){
    this.gameState = 'running';
    if (this.ball) {
      this.jump();
      this.ball.move();
    }
  }
  jump(){
    this.ball.dy = this.ball.dx = (Math.floor(Math.random() * (1 - -1 + 1)) + -1) * this.ball.velocity || 5;
    this.ball.animate();
  }
  collide(element){
    const x = this.ball.x + this.ball.dx;     // coords of the ball on the next frame
    const y = this.ball.y + this.ball.dy;     // to prevent sprites visual overlap
    if (x < element.x + element.width &&      // hit the brick from the right side
        x + this.ball.width > element.x &&    // hit the brick from the left side
        y < element.y + element.height &&     // hit the brick in the bottom
        y + this.ball.height > element.y) {   // hit the brick in the top
      return true;
    }
  }
  checkBounds(){
    const x = this.ball.x + this.ball.dx;
    const y = this.ball.y + this.ball.dy;
    if (x < 0) {
      this.ball.x = 0;
      this.ball.dx = this.ball.velocity;
    } else if (x + this.ball.width > this.width) {
      this.ball.x = this.width - this.ball.width;
      this.ball.dx = -this.ball.velocity;
    } else if (y < 0) {
      this.ball.y = 0;
      this.ball.dy = this.ball.velocity;
    } else if (y + this.ball.height >= this.height) {
      this.lostLife();
    }
  }
  bumpPaddle(paddle){
    this.ball.dy = -this.ball.velocity;
    this.ball.dx = this.onTheLeftSide(paddle) ? -this.ball.velocity : this.ball.velocity;
    this.sounds.snd2.play();
  }
  onTheLeftSide(paddle){
    return (this.ball.x + this.ball.width / 2) < (paddle.x + paddle.width / 2);
  }
  bumpBlock(brick){
    brick.strength -=1;
    if (this.ball.x < brick.x + brick.width &&
        this.ball.x + this.ball.width > brick.x &&
        this.ball.y >= brick.y + brick.height - 5) {
      this.ball.dy *= -1;
    } else if (this.ball.x < brick.x + brick.width &&
               this.ball.x + this.ball.width > brick.x &&
               this.ball.y + this.ball.height <= brick.y + 5) {
      this.ball.dy *= -1;
    } else {
      this.ball.dx *= -1;
    }
    this.sounds.snd1.play();
    this.vibrate([50]);
    this.sounds.snd1.currentTime = 0;
    this.score++;
    if (this.isWin()) {
      this.win();
    }
  }
  win(){
    this.over();
    this.sounds.snd4.play();
    this.vibrate([100, 500, 300, 500, 100, 500, 700]);
    this.level++;
  }
  isWin(){
    return this.bricks.filter(brickElement => brickElement.strength).length === 0;
  }
  lostLife (){
    this.minusLife = true;
    this.sounds.snd3.play();
    this.lives--;
    this.vibrate([500, 50, 500, 50, 500, 50]);
    this.over();
    if (this.lives < 1) {
      this.createResult();
      this.reset();
    }
  }
  over(){
    this.gameState = 'stopped';
  }
  reset(){
    this.lives = 3;
    this.score = 0;
    this.level = 1;
    this.createLevel();
    this.gameState = 'stopped';
  }
  vibrate(...[]){
    if(window.navigator && window.navigator.vibrate){
      window.navigator.vibrate([]);
    }
  }
  createResult() {
    const name = prompt('Enter your name');
    this.results
      .addValue(name, this.score)
      .then(() => {
        this.showResults();
      });
  }
  showResults() {
    const ul = document.getElementById('resultList');
    ul.innerHTML = '';
    this.results.getStorageInfo()
      .then(resultsObject => {
        Object.keys(resultsObject)
          .map(playerName => ({name: playerName, score: resultsObject[playerName]}))
          .sort((a, b) => {
            if (a.score > b.score) {
              return 1;
            }
            if (a.score < b.score) {
              return -1;
            }
            return 0;
          })
          .reverse()
          .slice(0, 10)
          .forEach((playerResObj) => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="player-name">${playerResObj.name}</div>
                            <div class="player-score">${playerResObj.score} pts</div>`;
            ul.appendChild(li);
          });
      });
  }
}


