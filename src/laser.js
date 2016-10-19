"use strict";

/**
 * @module exports the laser class
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
    ctx.fillRect(this.position.x, this.position.y , this.width, this.height);
    ctx.restore();
}