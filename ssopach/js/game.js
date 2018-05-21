'use strict';

function gameLoop(game) {

  var currentState = game.currentState();

  if (currentState) {
    //  Delta t is the time to update/draw
    var dt = 1 / game.config.fps;

    //  Get the drawing context
    var ctx = game.gameCanvas.getContext('2d');

    //  Update if we have an update function
    if (currentState.update) {
      currentState.update(game, dt);
    }
    //  Draw if we have a draw function
    if (currentState.draw) {
      currentState.draw(game, dt, ctx);
    }
  }
}

function Game() {
  this.gameId = null;
  //Set CONSTANTS for initial game configuration
  this.config = {
    //Game
    gameWidth: 700,
    gameHeight: 400,
    fps: 60,
    levelHardnessMult: 0.5,
    //Hero
    heroSpeed: 300,
    heroFireRate: 10,
    //Projectile
    projectileVelocity: 120,
    projectileMaxFireRate: 10,
    //Insect
    insectRows: 4,
    insectCols: 10,
    insectInitialVelocity: 30,
    insectAcceleration: 10,
    insectDropDistance: 30,
    pointsForInsect: 5,
    //Spits
    spitChance: 0.02,
    spitMinVelocity: 50,
    spitMaxVelocity: 100
  };
  // Set VARS for game state description
  this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
  this.width = 0;
  this.height = 0;
  this.lives = 3;
  this.level = 1;
  this.score = 0;
  // Input
  this.pressedKeys = {};
  this.gameCanvas =  null;
  //  The state stack
  this.stateStack = [];
  //  All sounds
  this.sounds = null;
}

Game.prototype.setup = function(gameCanvas) {
  this.gameCanvas = gameCanvas;
  this.width = gameCanvas.width;
  this.height = gameCanvas.height;

  this.gameBounds = {
    left: gameCanvas.width / 2 - this.config.gameWidth / 2,
    right: gameCanvas.width / 2 - this.config.gameWidth / 2,
    top: gameCanvas.height / 2 - this.config.gameHeight / 2,
    bottom: gameCanvas.height / 2 - this.config.gameHeight / 2
  };

};

Game.prototype.start = function () {
  var self = this;
  var game = this.gameId;

  //  Move into the 'welcome' state
  self.moveToState(new WelcomeState());

  //  Set the game variables
  self.lives = 3;

  // Start the game Loop
  self.intervalId = setInterval(function() {
    gameLoop(game);}, 1000 / self.config.fps);
};

//  Inform the game a key is Down
Game.prototype.keyDown = function(keyCode) {
  this.pressedKeys[keyCode] = true;
  //  Delegate to the current state too
  if (this.currentState() && this.currentState().keyDown) {
    this.currentState().keyDown(this, keyCode);
  }
};

//  Inform the game a key is Up
Game.prototype.keyUp = function(keyCode) {
  delete this.pressedKeys[keyCode];
  //  Delegate to the current state too.
  if(this.currentState() && this.currentState().keyUp) {
    this.currentState().keyUp(this, keyCode);
  }
};

Game.prototype.moveToState = function(state) {
  var self = this;
  var game = this.gameId;

  //  If we are in a state, leave it
  if(self.currentState() && self.currentState().leave) {
    self.currentState().leave(game);
    self.stateStack.pop();
  }

  //  If there's an enter function for the new state, call it
  if(state.enter) {
    state.enter(game);
  }

  //  Set the current state
  this.stateStack.pop();
  this.stateStack.push(state);
};

Game.prototype.currentState = function() {
  return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

Game.prototype.pushState = function(state) {

  //  If there's an Enter function for the new state, call it
  if(state.enter) {
    state.enter(game);
  }
  //  Set the current state.
  this.stateStack.push(state);
};

Game.prototype.popState = function() {

  //  Leave and pop the state.
  if(this.currentState()) {
    if(this.currentState().leave) {
      this.currentState().leave(game);
    }

    //  Set the current state.
    this.stateStack.pop();
  }
};

Game.prototype.mute = function(mute) {

  //  If we've been told to mute, mute.
  if (mute) {
    this.sounds.mute = true;
  } else if (!mute) {
    this.sounds.mute = false;
  } else {
    // Toggle mute instead...
    this.sounds.mute = !this.sounds.mute;
  }
};

function PlayState (config, level) {
  this.config = config;
  this.level = level;

  //Game State
  this.lastProjectileTime = null;
  this.insectCurrentVelocity = 25;

  //Game Entities
  this.hero = null;
  this.insects = [];
  this.projectiles = [];
  this.spits = [];
}

PlayState.prototype.enter = function(game) {
  //Create HERO bottom center
  this.hero = new Hero(game.width / 2, game.height - game.gameBounds.bottom);

  //  Setup initial state
  this.insectCurrentVelocity = 10;
  this.insectCurrentDropDistance = 0;

  //Setup params for Hero
  this.heroSpeed = this.config.heroSpeed;
  var levelMultiplier = this.level * this.config.levelHardnessMult;

  //Setup params for Insects
  this.spitChance = this.config.spitChance;
  this.insectInitialVelocity = this.config.insectInitialVelocity * (levelMultiplier + 1);
  this.spitChance = this.config.spitChance * (levelMultiplier + 1);
  this.spitMinVelocity = this.config.spitMinVelocity * (levelMultiplier + 1);
  this.spitMaxVelocity = this.config.spitMaxVelocity * (levelMultiplier + 1);

  //Create the Insects
  var insects = [];
  var raws = this.config.insectRows;
  var cols = this.config.insectCols;

  for (var raw = 0; raw < raws; raw++) {
    for (var col = 0; col < cols; col++) {
      insects.push(new Insect(
        (game.width / 2) + ((cols / 2 - col) * 200 / cols),
        (game.gameBounds.top + raw * 20),
        raw, col, 'Insect'));
    }
  }
  this.insects = insects;
  this.insectCurrentVelocity = this.insectInitialVelocity;
  this.insectVelocity = {x: -this.insectInitialVelocity, y: 0};
  this.insectNextVelocity = null;
};

PlayState.prototype.update = function(game, dt) {
  // Move Hero LEFT
  if (game.pressedKeys[37]) {
    this.hero.x -= this.heroSpeed * dt;
  }
  // Move Hero RIGHT
  if (game.pressedKeys[39]) {
    this.hero.x += this.heroSpeed * dt;
  }
  // Fire
  if(game.pressedKeys[32]) {
    this.fireProjectile();
    game.sounds.playSound('fire');
  }
  //  Keep the HERO in bounds
  if (this.hero.x < game.gameBounds.left) {
    this.hero.x = game.gameBounds.left;
  }
  if (this.hero.x > game.width - game.gameBounds.right) {
    this.hero.x = game.width - game.gameBounds.right;
  }

  //  Find all of the front rank invaders.
  var frontInsects = {};
  for ( var i = 0; i < this.insects.length; i++) {
    var insect = this.insects[i];
    //  If we have no insect for game file, or the invader
    //  for game file is futher behind, set the front
    //  raw insect to game one.
    if (!frontInsects[insect.col] || frontInsects[insect.col].raw < insect.raw) {
      frontInsects[insect.col] = insect;
    }
  }

  //  Give each front raw insect a chance to spit
  for ( var i = 0; i < this.config.insectCols; i++) {
    var insect = frontInsects[i];
    if (!insect) continue;
    var chance = this.spitChance * dt;
    if (chance > Math.random()) {
      //  Fire!
      this.spits.push(new Spit(insect.x, insect.y + insect.height / 2,
        this.spitMinVelocity + Math.random()*(this.spitMaxVelocity - this.spitMinVelocity)));
    }
  }

  //  Move the insects
  var hitLeft = false;
  var hitRight = false;
  var hitBottom = false;

  for (var i = 0; i < this.insects.length; i++) {
    var insect = this.insects[i];
    var newx = insect.x + this.insectVelocity.x * dt;
    var newy = insect.y + this.insectVelocity.y * dt;

    if (!hitLeft && newx < game.gameBounds.left) {
      hitLeft = true;
    }
    else if (!hitRight && newx > game.width - game.gameBounds.right) {
      hitRight = true;
    }
    else if (!hitBottom && newy > game.height - game.gameBounds.bottom) {
      hitBottom = true;
    }
    if(!hitLeft && !hitRight && !hitBottom) {
      insect.x = newx;
      insect.y = newy;
    }
  }

  //  Update insect velocities
  this.insectCurrentDropDistance += this.insectVelocity.y * dt;
  if (this.insectCurrentDropDistance >= this.config.insectDropDistance) {
    this.insectVelocity = this.insectNextVelocity;
    this.insectCurrentDropDistance = 0;
  }

  if (hitLeft) {
    this.insectCurrentVelocity += this.config.insectAcceleration;
    this.insectVelocity = {x: 0, y: this.insectCurrentVelocity };
    this.insectNextVelocity = {x: this.insectCurrentVelocity , y:0};
  }
  //  If we've hit the right, move down then left.
  if (hitRight) {
    this.insectCurrentVelocity += this.config.insectAcceleration;
    this.insectVelocity = {x: 0, y: this.insectCurrentVelocity };
    this.insectNextVelocity = {x: -this.insectCurrentVelocity , y:0};
  }
  //  Game over
  if (hitBottom) {
    this.lives = 0;
  }

  //  Move each projectile
  for (var i = 0; i < this.projectiles.length; i++) {
    var projectile = this.projectiles[i];
    projectile.y -= dt * projectile.velocity;

    //  If the projectile has gone off the screen remove it
    if(projectile.y < 0) {
      this.projectiles.splice(i--, 1);
    }
  }

  //  Move each spit
  for (var i = 0; i < this.spits.length; i++) {
    var spit = this.spits[i];
    spit.y += dt * spit.velocity;

    //  If the projectile has gone off the screen remove it
    if(spit.y > this.height) {
      this.spits.splice(i--, 1);
    }
  }

  //  Check for projectile/insect collisions
  for (var i = 0; i < this.insects.length; i++) {
    var insect = this.insects[i];
    var bang = false;

    for(var j = 0; j < this.projectiles.length; j++){
      var projectile = this.projectiles[j];

      if (projectile.x >= (insect.x - insect.width/2) && projectile.x <= (insect.x + insect.width / 2) &&
        projectile.y >= (insect.y - insect.height/2) && projectile.y <= (insect.y + insect.height / 2)) {

        //  Remove the projectile, set 'bang' so we don't process
        //  this case again
        this.projectiles.splice(j--, 1);
        bang = true;
        game.score += this.config.pointsForInsect;
        break;
      }
    }
    if(bang) {
      this.insects.splice(i--, 1);
      game.sounds.playSound('bang');
    }
  }

  //  Check for insect/hero collisions
  for ( var i = 0; i < this.insects.length; i++) {
    var insect = this.insects[i];
    if ((insect.y + insect.height / 2) > (this.hero.y - this.hero.height / 2) &&
      (insect.y - insect.height / 2) < (this.hero.y + this.hero.height / 2)) {
      console.log('Dead by collision!');
      game.lives = 0;
      game.sounds.playSound('explosion');
    }
  }

  //  Check for spit/hero collisions
  for ( var i = 0; i < this.spits.length; i++) {
    var spit = this.spits[i];
    if (spit.x >= (this.hero.x - this.hero.width/2) && spit.x <= (this.hero.x + this.hero.width/2) &&
      spit.y >= (this.hero.y - this.hero.height/2) && spit.y <= (this.hero.y + this.hero.height/2)) {
      this.spits.splice(i--, 1);
      game.lives--;
      game.sounds.playSound('explosion');
    }
  }

  //  Check for Game Over
  if(game.lives <= 0) {
    game.moveToState(new GameOverState());
  }

  //  Check for victory
  if (this.insects.length === 0) {
    game.score += this.level * 50;
    game.level += 1;
    game.moveToState(new LevelIntroState(game.level));
  }
};

PlayState.prototype.fireProjectile = function () {
  var self = this;

  //  If we have no last projectile time, or the last projectile time
  //  is older than the max projectile rate, we can fire
  if(self.lastProjectileTime === null ||
    ((new Date()).valueOf() - self.lastProjectileTime) > (1000 / self.config.projectileMaxFireRate)) {
    //  Add a projectile
    self.projectiles.push(new Projectile(self.hero.x, self.hero.y - 12, self.config.projectileVelocity));
    self.lastProjectileTime = (new Date()).valueOf();
    self.sounds.playSound('fire');
    //  Play the 'fire' sound
  }
};

PlayState.prototype.draw = function (game, dt, ctx) {

  //  Clear the background
  ctx.fillStyle = '#000a12';
  ctx.fillRect(0, 0, game.width, game.height);

  //  Draw hero
  ctx.fillStyle = '#0e645c';
  ctx.fillRect(this.hero.x - (this.hero.width / 2),
    this.hero.y - (this.hero.height / 2), this.hero.width, this.hero.height);

  //  Draw insects
  ctx.fillStyle = '#66414d';
  for (var i = 0; i < this.insects.length; i++) {
    var insect = this.insects[i];
    ctx.fillRect(insect.x - insect.width/2, insect.y - insect.height/2,
      insect.width, insect.height);
  }

  //  Draw projectiles
  ctx.fillStyle = '#ff0000';
  for (var i = 0; i < this.projectiles.length; i++) {
    var projectile = this.projectiles[i];
    ctx.fillRect(projectile.x, projectile.y - 3, 3, 4);
  }

  //  Draw spits
  ctx.fillStyle = '#ff00ff';
  for (var i = 0; i < this.spits.length; i++) {
    var spit = this.spits[i];
    ctx.fillRect(spit.x, spit.y - 3, 3, 2);
  }

  //  Draw info
  var textPosY = game.gameBounds.top - game.gameBounds.top / 3;
  ctx.font="1em Exo2-Regular";
  ctx.fillStyle = '#fff';
  var info = 'Lives: ' + game.lives;
  ctx.textAlign = 'left';
  ctx.fillText(info, game.width / 2 - 200, textPosY);
  info = 'Level: ' + game.level;
  ctx.textAlign = 'center';
  ctx.fillText(info, game.width / 2, textPosY);
  info = 'Score: ' + game.score;
  ctx.textAlign = 'right';
  ctx.fillText(info, game.width / 2 + 200, textPosY);
};

PlayState.prototype.keyDown = function(game, keyCode) {
  if (keyCode === 32) {
    //  Fire!
    game.fireProjectile();


  }
  //  Push the pause state, ESC or p
  if (keyCode === 80 || keyCode === 27) {
    game.pushState(new PauseState());
  }
};

function WelcomeState () {
  
}

WelcomeState.prototype.enter = function(game) {

  // Create and load the sounds.
  game.sounds = new Sounds();
  game.sounds.init();
  game.sounds.loadSound('shoot', 'sounds/shoot.wav');
  game.sounds.loadSound('bang', 'sounds/gameOver.mp3');
  game.sounds.loadSound('explosion', 'sounds/explosion.wav');
  game.sounds.loadSound('fire', 'sounds/shoot.wav');
};

WelcomeState.prototype.update = function (game, dt) {

};

WelcomeState.prototype.draw = function (game, dt, ctx) {
  //  Clear the background
  ctx.fillStyle = '#000a12';
  ctx.fillRect(0, 0, game.width, game.height);

  ctx.font = '2em Exo2-Bold';
  ctx.textBaseline = 'center';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('Siladereva.by presents', game.width / 2, game.height/2 - 50);

  ctx.fillStyle = '#fafafa';
  ctx.font = '3em Exo2-Bold';
  ctx.fillText('WOOD BOOM BUGS', game.width / 2, game.height/2);

  ctx.fillStyle = '#fafafa';
  ctx.font = '1em Exo2-Regular';
  ctx.fillText('Press Space to start', game.width / 2, game.height/2 + 36);
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
  if(keyCode === 32) {
    // Space starts the game
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.moveToState(new LevelIntroState(game.level));
  }
};

function GameOverState() {
}

GameOverState.prototype.draw = function(game, dt, ctx) {
  // Clear the background
  ctx.fillStyle = '#000a12';
  ctx.fillRect(0, 0, game.width, game.height);

  ctx.font = '2em Exo2-Bold';
  ctx.textBaseline = 'center';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fafafa';
  ctx.fillText ('Game Over!', game.width / 2, game.height/2 - 40);

  ctx.font = '1em Exo2-Regular';
  ctx.fillText ('You scored ' + game.score + ' and got to level ' + game.level, game.width / 2, game.height/2);

  ctx.font = '1em Exo2-Regular';
  ctx.fillText('Press Space to play again', game.width / 2, game.height/2 + 36);
};

GameOverState.prototype.keyDown = function(game, keyCode) {
  if(keyCode === 32) {
    //  Space restarts the game
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.moveToState(new LevelIntroState(game.level));
  }
};

function LevelIntroState(level) {
  this.level = level;
  this.countdownMessage = '3';
}

LevelIntroState.prototype.update = function (game, dt) {
  //  Update the countdown
  if (this.countdown === undefined) {
    this.countdown = 3; // countdown from 3 secs
  }
  this.countdown -= dt;

  if (this.countdown < 2) {
    this.countdownMessage = '2';
  }
  if (this.countdown < 1) {
    this.countdownMessage = '1';
  }
  if (this.countdown <= 0) {
    //  Move to the next level, popping this state.
    game.moveToState(new PlayState(game.config, this.level));
  }
};

LevelIntroState.prototype.draw = function(game, dt, ctx) {
  //  Clear the background
  ctx.save();
  ctx.fillStyle = '#000a12';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.restore();

  ctx.font = '2em Exo2-Bold';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fafafa';
  ctx.fillText( 'Level ' + this.level, game.width / 2, game.height / 2 - 50);

  ctx.font = '3em Exo2-Regular';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('Ready in ' + this.countdownMessage, game.width / 2, game.height/2);
};

LevelIntroState.prototype.keyDown = function(game, keyCode) {
};

function PauseState() {
}

PauseState.prototype.keyDown = function(game, keyCode) {
  if (keyCode === 80 || keyCode === 27) {
    //  Pop the pause state
    game.popState();
  }
};

PauseState.prototype.draw = function(game, dt, ctx) {
  //  Clear the background
  ctx.save();
  ctx.fillStyle = "rgba(0, 10, 18, 0.05)";
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.restore();

  ctx.font = '2em Exo2-Regular';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('Game paused', game.width / 2, game.height / 2 - 40);

  ctx.font = '1em Exo2-Regular';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('Press p to continue', game.width / 2, game.height / 2);
};

function Sounds() {

  //  The audio context.
  this.audioContext = null;

  //  The actual set of loaded sounds.
  this.sounds = {};
}

Sounds.prototype.init = function() {

  //  Create the audio context
  var context = window.AudioContext || window.webkitAudioContext;
  this.audioContext = new context();
  this.mute = false;
};

Sounds.prototype.loadSound = function(name, url) {

  //  Reference to ourselves for closures
  var self = this;

  //  Create an entry in the sounds object
  this.sounds[name] = null;

  //  Create an asynchronous request for the sound
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';
  req.onload = function() {
    self.audioContext.decodeAudioData(req.response, function(buffer) {
      self.sounds[name] = {buffer: buffer};
    });
  };
  try {
    req.send();
  } catch(e) {
    console.log("An exception occured getting sound the sound " + name + " this might be " +
      "because the page is running from the file system, not a webserver.");
    console.log(e);
  }
};

Sounds.prototype.playSound = function(name) {

  //  If we've not got the sound, don't bother playing it.
  if(this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
    return;
  }

  //  Create a sound source, set the buffer, connect to the speakers and
  //  play the sound.
  var source = this.audioContext.createBufferSource();
  source.buffer = this.sounds[name].buffer;
  source.connect(this.audioContext.destination);
  source.start(0);
};

function Hero (x , y) {
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 15;
  this.show = function() {
    // fill(255);
    // rectMode(CENTER);
    // rect(this.x, height-20, 60, 20);
    image(this.graphic, this.x, this.y+20, 50);
  }
}

function Insect(x ,y, raw, col, type) {
  this.x = x;
  this.y = y;
  this.raw = raw;
  this.col = col;
  this.type = type;
  this.width = 16;
  this.height = 12;
}

function Projectile(x, y, velocity) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
}

function Spit(x, y, velocity) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
}


