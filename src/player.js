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
function Player(position, canvas, lasers, game) {
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
  this.game = game;
  this.lasers = [];
  this.shield = false;
  var shootLaser = new Audio();
  shootLaser.src = 'assets/Laser_Shoot.wav';

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
        self.lasers.push(new Laser(self.position, Vector.rotate(self.velocity, self.angle), self.angle));
        shootLaser.play();
        self.shooting = true;
        break;
      case 'g':
        self.shield = true;
        break;
      case 'Escape':
        if (self.game.paused) {
            self.game.idPaused.style.display = "none";
            self.game.paused = false;
        }
        else {
            self.game.paused = true;
            self.game.idPaused.style.display = "block";
        }
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
      case 'g':
        self.shield = false;
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

  // ctx.fillStyle ='red'
  // ctx.fillRect(this.position.x, this.position.y , 5, 5);

  if(this.shield) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.arc(this.position.x, this.position.y, 15, 0, 2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.arc(this.position.x, this.position.y, 16, 0, 2*Math.PI);
    ctx.stroke();
  }

}
