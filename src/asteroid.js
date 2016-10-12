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
    this.velocity = {
        x: Math.random() * (2 + 2) - 2,
        y: Math.random() * (2 + 2) - 2
    };
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
    // ctx.beginPath();
    // ctx.strokeStyle = 'grey';
    // // ctx.arc(100,75,50,0,2*Math.PI);
    // ctx.arc(100,75,50,0,2*Math.PI);
    // ctx.stroke();
}