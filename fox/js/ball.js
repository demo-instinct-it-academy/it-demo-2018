'use strict';

class Ball {
  constructor() {
    this.frame = 0;
    this.width = 22;
    this.height = 22;
    this.x = 0;
    this.y = 0;
    this.velocity = 5;
    this.dx = 0;
    this.dy = 0;
    this.animateId = null;
    this.gameWidth = g.width;
    this.gameHeight = g.height;
    this.paddleHeight = 24;
  }
  init() {
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.paddleHeight - this.height - 5.5;
    this.dx = 0;
    this.dy = 0;
    this.sticky = true;
    if (this.animateId) {
      clearInterval(this.animateId);
      this.animateId = null;
    }
  }
  animate (){
    this.animateId = setInterval(() => {
      this.frame++;
      if (this.frame > 3) {
        this.frame = 0;
      }
    }, 100);
  }
  move (){
    this.x += this.dx;
    this.y += this.dy;
  }
  stop (){
    this.dx = 0;
  };
}