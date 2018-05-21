'use strict';

class Paddle {
  constructor () {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.velocity = 6;
    this.width = 104;
    this.height = 24;
    this.gameWidth = g.width;
    this.gameHeight = g.height;
  }
  init (){
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height - 5;
  };
  stop (){
    this.dx = 0;
  };
  move (){
    if ((this.x < 0 && this.dx < 0) || (this.x + this.width >= this.gameWidth && this.dx > 0 )) {
      this.stop();
    }
    if (this.x + this.dx < 0) {
      this.x = 0;
    } else if (this.x + this.width > this.gameWidth) {
      this.x = this.gameWidth - this.width;
    } else {
      this.x += this.dx;
    }
  }
}