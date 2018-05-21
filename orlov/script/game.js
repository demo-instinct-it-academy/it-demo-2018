var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 360;

var game = {
  score: 0,
  lives: 3,
  resize: function () {
    var ratio = canvas.width / canvas.height;
    var height = window.innerHeight;
    var width = height * ratio;
    if (width > window.innerWidth) {
      width = window.innerWidth;
      height = width / ratio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
};
var ball = {
  posX: canvas.width / 2,
  posY: canvas.height - 30,
  SpeedX: 3,
  SpeedY: -3,
  Radius: canvas.width / 50,
  update: function () {
    this.posX += this.SpeedX;
    this.posY += this.SpeedY;
  }
};

var paddle = {
  height: 10,
  width: 75,
  posX: (canvas.width - 75 )/ 2,
  moveRight: false,
  moveLeft: false,

  move: function (e) {
    if (e.keyCode === 39) {
      paddle.moveRight = true;
    } else if (e.keyCode === 37) {
      paddle.moveLeft = true;
    }
  },

  stop: function (e) {
    if (e.keyCode === 39) {
      paddle.moveRight = false;
    } else if (e.keyCode === 37) {
      paddle.moveLeft = false;
    }
  }
};

var brick = {
  columnCount: 5,
  rowCount: 3,
  Width: 75,
  Height: 20,
  Padding: 10,
  OffsetTop: 30,
  OffsetLeft: 30
};


var bricks = [];
for (var c = 0; c < brick.rowCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brick.columnCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

var RequestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

window.addEventListener('resize', game.resize, false);
document.addEventListener("keydown", paddle.move, false);
document.addEventListener("keyup", paddle.stop, false);


function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.posX, ball.posY, ball.Radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.posX, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brick.rowCount; c++) {
    for (var r = 0; r < brick.columnCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (r * (brick.Width + brick.Padding)) + brick.OffsetLeft;
        var brickY = (c * (brick.Height + brick.Padding)) + brick.OffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brick.Width, brick.Height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + game.score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + game.lives, canvas.width - 65, 20);
}

function collisionDetection() {
  for (var c = 0; c < brick.rowCount; c++) {
    for (var r = 0; r < brick.columnCount; r++) {
      var b = bricks[c][r];
      if (b.status === 1) {
        if (ball.posX > b.x && ball.posX < b.x + brick.Width && ball.posY > b.y && ball.posY < b.y + brick.Height) {
          ball.SpeedY = -ball.SpeedY;
          b.status = 0;
          game.score++;
          if (game.score === brick.columnCount * brick.rowCount) {
            alert("win");
            document.location.reload();
          }
        }
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (ball.posX + ball.SpeedX > canvas.width - ball.Radius || ball.posX + ball.SpeedX < ball.Radius) {
    ball.SpeedX = -ball.SpeedX;
  }
  if (ball.posY + ball.SpeedY < ball.Radius) {
    ball.SpeedY = -ball.SpeedY;
  }
  else if (ball.posY + ball.SpeedY > canvas.height - ball.Radius - paddle.height) {
    if (ball.posX > paddle.posX && ball.posX < paddle.posX + paddle.width) {
      ball.SpeedY = -ball.SpeedY;
    } else {
      game.lives--;
      if (!game.lives) {
        alert("dno, game over");
        document.location.reload();
      } else {
        ball.posX = canvas.width / 2;
        ball.posY = canvas.height - 30;
        ball.SpeedX = 2;
        ball.SpeedY = -2;
        paddle.posX = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (paddle.moveRight && paddle.posX < canvas.width - paddle.width) {
    paddle.posX += 7;
  } else if (paddle.moveLeft && paddle.posX > 0) {
    paddle.posX -= 7;
  }
  ball.update();
}

function draw() {
  update();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  RequestAnimationFrame(draw);
}

draw();
