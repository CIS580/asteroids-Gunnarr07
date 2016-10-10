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
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {

}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {

}