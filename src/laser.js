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
        x: 0,
        y: 0
    }
    this.velocity = {
        x: 0,
        y: 0
    };
    this.angle = 0;
    this.width = 10;
    this.height = 20;
}

/**
 * @function updates the Laser object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Laser.prototype.update = function(time) {

}

/**
 * @function renders the Laser into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Laser.prototype.render = function(time, ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
}