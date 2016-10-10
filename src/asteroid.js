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
function Asteroid(position) {
    this.position = {
        x: position.x,
        y: position.y
    }
}

/**
 * @function updates the Asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {

}

/**
 * @function renders the Asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    // ctx.arc(100,75,50,0,2*Math.PI);
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();
}