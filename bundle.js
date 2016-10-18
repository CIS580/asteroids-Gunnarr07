(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Vector = require('./vector');
const Asteroid = require('./asteroid');
const Laser = require('./laser');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);

var lasers;
//lasers.push(new Laser());
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas, lasers);


var background = new Image();
background.src = 'assets/bg5.png';

var asteroidTypes = []
var asteroid1 = new Image();
asteroid1.src ='assets/c10008.png';
asteroidTypes.push(asteroid1);
var asteroid2 = new Image();
asteroid2.src = 'assets/c30008.png';
asteroidTypes.push(asteroid2);
var asteroid3 = new Image();
asteroid3.src = 'assets/c40009.png';
asteroidTypes.push(asteroid3);
//entities.addEntity(player);

var axisList = [];
var asteroids = [];

// for (var i = 0; i < 10; i++) {
//     asteroids.push(new Asteroid({x: Math.floor(Math.random() * (canvas.width - 1)), y: Math.floor(Math.random() * (canvas.height - 1))}, canvas));
// }

for(var i = 0; i < 10; i++) {
  asteroids.push({
    asteriod: asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)],
    position: {x:Math.floor(Math.random() * (canvas.width - 1)), y:  Math.floor(Math.random() * (canvas.height - 1))},
    mass: Math.random() * (20-10) + 10,
    velocity: { x: Math.random() * (2 + 2) - 2, y: Math.random() * (2 + 2) - 2 },
    width: 64,
    height: 64
  });
  axisList.push(asteroids[i]);
}
axisList.sort(function(a,b){return a.position.x - b.position.x});

// for(var i = 0; i < 10; i++)
// asteroids.forEach(function(asteroid) {
//   entities.addEntity(asteroid);
// });

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  lasers = player.lasers;
  // lasers.forEach(function(laser) {
  //   axisList.push(laser);
  // });

  asteroids.forEach(function(asteriod, index) {
    // Apply velocity
    asteriod.position.x += asteriod.velocity.x;
    asteriod.position.y += asteriod.velocity.y;

    // Wrap around the screen
    if(asteriod.position.x < 0) asteriod.position.x += canvas.width;
    if(asteriod.position.x > canvas.width) asteriod.position.x -= canvas.width;
    if(asteriod.position.y < 0) asteriod.position.y += canvas.height;
    if(asteriod.position.y > canvas.height) asteriod.position.y -= canvas.height;
  });

  axisList.sort(function(a,b){return a.position.x - b.position.x});

  var active = [];

  var potentiallyColliding = [];

  axisList.forEach(function(asteriod, aindex) {
    active = active.filter(function(oasteriod) {
      return asteriod.position.x - oasteriod.position.x < 30;
    });
    active.forEach(function(oasteriod, bindex) {
      potentiallyColliding.push({a: oasteriod, b: asteriod});
    });
    active.push(asteriod);
  });

  var collisions = [];
  potentiallyColliding.forEach(function(pair) {
    var distSquared = 
    Math.pow(pair.a.position.x - pair.b.position.x, 2) +
    Math.pow(pair.a.position.y - pair.b.position.y, 2);
    // (32 + 32)^2 = 4096 -> sum of two asteriodss' raidius squared
    if(distSquared < Math.pow((pair.a.width / 2) + (pair.b.width / 2), 2)) {
      collisions.push(pair);
    }
  });

  // Check for collisions with other asteriods
  collisions.forEach(function(pair) {
    // var circle1 = {radius: pair.a.width / 2, x: pair.a.position.x + pair.a.width, y: pair.a.position.y + pair.a.width};
    // var circle2 = {radius: pair.b.width / 2, x: pair.b.position.x + pair.b.width, y: pair.b.position.y + pair.b.width};

    // var dx = circle1.x - circle2.x;
    // var dy = circle1.y - circle2.y;
    // var distance = Math.sqrt(dx * dx + dy * dy);

    // if (distance < circle1.radius + circle2.radius) {
    //     // collision detected!
    //     var v1 = {x: pair.a.velocity.x, y: pair.a.velocity.y};
    //     var v2 = {x: pair.b.velocity.x, y: pair.b.velocity.y};
    //     var m1 = pair.a.mass;
    //     var m2 = pair.b.mass;
    //     pair.b.velocity.x = (v2.x * ((m2 - m1) / (m2 + m1))) + (v1.x * ((2 * m1) / (m2 + m1)));
    //     pair.b.velocity.y = (v2.y * ((m2 - m1) / (m2 + m1))) + (v1.y * ((2 * m1) / (m2 + m1)));

    //     pair.a.velocity.x = (v1.x * ((m2 - m1) / (m2 + m1))) + (v2.x * ((2 * m1) / (m2 + m1)));
    //     pair.a.velocity.y = (v1.y * ((m2 - m1) / (m2 + m1))) + (v2.y * ((2 * m1) / (m2 + m1)));
    // }
        // Find the normal of collision
        var collisionNormal = {
          x: pair.a.position.x - pair.b.position.x,
          y: pair.a.position.y - pair.b.position.y
        }
        // Calculate the overlap between balls
        var overlap = 66 - Vector.magnitude(collisionNormal);
        var collisionNormal = Vector.normalize(collisionNormal);
        pair.a.position.x += collisionNormal.x * overlap /2;
        pair.a.position.y += collisionNormal.y * overlap / 2;
        pair.b.position.x -= collisionNormal.x * overlap / 2;
        pair.b.position.y -= collisionNormal.y * overlap / 2;
        // Rotate the problem space so that the normal
        // of collision lies along the x-axis
        var angle = Math.atan2(collisionNormal.y, collisionNormal.x);
        var a = Vector.rotate(pair.a.velocity, angle);
        var b = Vector.rotate(pair.b.velocity, angle);
        // Solve the collision along the x-axis applling the vilosity equation
        var v1 = {x: pair.a.velocity.x, y: pair.a.velocity.y};
        var v2 = {x: pair.b.velocity.x, y: pair.b.velocity.y};
        var m1 = pair.a.mass;
        var m2 = pair.b.mass;
        pair.b.velocity.x = (v2.x * ((m2 - m1) / (m2 + m1))) + (v1.x * ((2 * m1) / (m2 + m1)));
        pair.b.velocity.y = (v2.y * ((m2 - m1) / (m2 + m1))) + (v1.y * ((2 * m1) / (m2 + m1)));

        pair.a.velocity.x = (v1.x * ((m2 - m1) / (m2 + m1))) + (v2.x * ((2 * m1) / (m2 + m1)));
        pair.a.velocity.y = (v1.y * ((m2 - m1) / (m2 + m1))) + (v2.y * ((2 * m1) / (m2 + m1)));
        // Rotate the problem space back to world space
        a = Vector.rotate(a, -angle);
        b = Vector.rotate(b, -angle);
        pair.a.velocity.x = a.x;
        pair.a.velocity.y = a.y;
        pair.b.velocity.x = b.x;
        pair.b.velocity.y = b.y;
    
  });

  lasers.forEach(function(laser, lindex) {
    asteroids.forEach(function(asteriod, aindex) {
      var circle1 = {radius: laser.width / 2, x: laser.position.x + laser.width, y: laser.position.y + laser.width};
      var circle2 = {radius: asteriod.width / 2, x: asteriod.position.x + asteriod.width, y: asteriod.position.y + asteriod.width};

      var dx = circle1.x - circle2.x;
      var dy = circle1.y - circle2.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < circle1.radius + circle2.radius) {
          // collision detected!
          if(asteriod.width == 64) {
            var m = asteriod.mass / 2;
            asteriod.mass  = m;
            asteriod.width = 32;
            asteriod.height = 32;
            
            // Remove laser
            lasers.splice(lindex, 1);

            // Explosion add smaller asteriods
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
              width: 32,
              height: 32
            });
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
              width: 32,
              height: 32
            });
            axisList.push(asteroids[i]);
            axisList.sort(function(a,b){return a.position.x - b.position.x});
          }
          else if(asteriod.width == 32) {
            var m = asteriod.mass / 2;
            asteriod.mass  = m;
            asteriod.width = 16;
            asteriod.height = 16;
            lasers.splice(index, 1);
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
              width: 16,
              height: 16
            });
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
              width: 16,
              height: 16
            });
            axisList.push(asteroids[i]);
            axisList.sort(function(a,b){return a.position.x - b.position.x});
          }
          if(asteriod.width == 16) {
            asteroids.splice(aindex, 1);
          }
        //   var v1 = {x: pair.a.velocity.x, y: pair.a.velocity.y};
        //   var v2 = {x: pair.b.velocity.x, y: pair.b.velocity.y};
        //   var m1 = pair.a.mass;
        //   var m2 = pair.b.mass;
        //   pair.b.velocity.x = (v2.x * ((m2 - m1) / (m2 + m1))) + (v1.x * ((2 * m1) / (m2 + m1)));
        //   pair.b.velocity.y = (v2.y * ((m2 - m1) / (m2 + m1))) + (v1.y * ((2 * m1) / (m2 + m1)));

        //   pair.a.velocity.x = (v1.x * ((m2 - m1) / (m2 + m1))) + (v2.x * ((2 * m1) / (m2 + m1)));
        //   pair.a.velocity.y = (v1.y * ((m2 - m1) / (m2 + m1))) + (v2.y * ((2 * m1) / (m2 + m1)));
      }
    });

  });




  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // ctx.fillStyle = "white";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.drawImage(
    // Image
    background,
    // Source
    0, 0, 1280, 1024,
    // Destination
    0, 0, canvas.width, canvas.height
  );

  player.render(elapsedTime, ctx);

  
  // asteroids.forEach(function(asteroid) {
  //   asteroid.render(elapsedTime, ctx);
  // });
  // entities.renderCells(ctx);
  
  asteroids.forEach(function(asteriod) {
    ctx.drawImage(
        // Image
        asteriod.asteriod,
        // Source
        80, 50, 160, 160,
        // Destination
        asteriod.position.x, asteriod.position.y, asteriod.width, asteriod.height
    );
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.arc(asteriod.position.x + 32, asteriod.position.y + 32, 32, 0, 2*Math.PI);
    ctx.stroke();
  });

  // lasers.forEach(function(laser) {
  //   laser.update();
  // });

  ctx.restore();
}

},{"./asteroid":2,"./game.js":3,"./laser":4,"./player.js":5,"./vector":6}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the asteroid class
 */
module.exports = exports = Asteroid;

/**
 * @constructor Asteroid
 * Create a new Asteroid object
 * @param {position} position object specifying an x and y
 */
function Asteroid(position, canvas) {
    this.worldWidth = canvas.width;
    this.worldHeight = canvas.height;
    this.position = {
        x: position.x,
        y: position.y
    };
    this.mass = Math.random() * (20-10) + 10;
    this.velocity = {
        x: Math.random() * (2 + 2) - 2,
        y: Math.random() * (2 + 2) - 2
    };
    this.mass = Math.random() * (10 - 5) + 5; // Random mass between min (inclusive) and max (exclusive)
    this.astroids = [];
    this.astroidL1 = new Image();
    this.astroidL1.src = 'assets/c10008.png';
    this.astroids.push(this.astroidL1);
    this.astroidL2 = new Image();
    this.astroidL2.src = 'assets/c30008.png';
    this.astroids.push(this.astroidL2);
    this.astroidL3 = new Image();
    this.astroidL3.src = 'assets/c40009.png';
    this.astroids.push(this.astroidL3);

    this.astroid = this.astroids[Math.floor(Math.random() * this.astroids.length)];
}

/**
 * @function updates the Asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {
    // Apply velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Wrap around the screen
    if(this.position.x < 0) this.position.x += this.worldWidth;
    if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
    if(this.position.y < 0) this.position.y += this.worldHeight;
    if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the Asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
    ctx.drawImage(
        // Image
        this.astroid,
        // Source
        80, 50, 160, 160,
        // Destination
        this.position.x, this.position.y, 64, 64
    );
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    // ctx.arc(100,75,50,0,2*Math.PI);
    ctx.arc(this.position.x + 32, this.position.y + 32, 32, 0, 2*Math.PI);
    ctx.stroke();
}
},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the asteroid class
 */
module.exports = exports = Laser;

/**
 * @constructor Laser
 * Create a new Laser object
 * @param {position} position object specifying an x and y
 */
function Laser(position, velocity, angle) { //position, velocity, angle
    // this.worldWidth = canvas.width;
    // this.worldHeight = canvas.height;
    this.position = {
        x: position.x,
        y: position.y
    }
    this.velocity = {
        x: velocity.x,
        y: velocity.y
    };
    this.angle = angle;
    this.width = 5;
    this.height = 5;
}

/**
 * @function updates the Laser object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Laser.prototype.update = function(time) {

    // this.position.x += 0;
    // this.position.y -= 3;

    // Apply velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
}

/**
 * @function renders the Laser into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Laser.prototype.render = function(time, ctx) {
    ctx.save();
    ctx.fillStyle = "red";
    //ctx.translate(this.position.x, this.position.y);
    //ctx.rotate(-this.angle);
    ctx.fillRect(this.position.x, this.position.y , this.width, this.height);
    ctx.restore();
}
},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;
const Laser = require('./laser');
const Vector = require('./vector');

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas, lasers) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.shooting = false;
  this.lasers = [];

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case ' ':
        console.log("shotting laser");
        console.log(self.angle);
        self.lasers.push(new Laser(self.position, Vector.rotate(self.velocity, self.angle), self.angle));
        //self.lasers.push(new Laser(self.position, Vector.normalize(self.velocity), self.angle));//Vector.normalize(self.velocity), self.angle));//{x: self.velocity.x + 1, y: self.velocity.y + 1}, self.angle));
        self.shooting = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  this.lasers.forEach(function(laser) {
    laser.update();
  });
  // if(this.shooting) {
  //   this.lasers.push(new Laser(this.position, {x: this.velocity.x + 1, y: this.velocity.y + 1}, this.angle));
  //   // this.lasers.forEach(function(laser) {
  //   //   laser.position.x = this.position.x;
  //   //   laser.position.y = this.position.y;
  //   //   laser.velocity.x = this.velocity.x;
  //   //   laser.velocity.y = this.velocity.y;
  //   //   laser.angle = this.angle;
  //   // });
  // }
 
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += 0.1;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();
  this.lasers.forEach(function(laser) {
    laser.render(time, ctx);
  });
  ctx.restore();

  ctx.save();
  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{"./laser":4,"./vector":6}],6:[function(require,module,exports){
"use strict";

module.exports = exports = {
    rotate: rotate,
    dotProduct: dotProduct,
    magnitude: magnitude,
    normalize: normalize
}

function rotate(a, angle) {
    return {
        x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
        y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
    };
}

function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y;
}

function magnitude(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a) {
    var mag = magnitude(a);
    return {x: a.x / mag, y: a.y / mag};
}
},{}]},{},[1]);
