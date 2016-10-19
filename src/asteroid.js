"use strict";

/**
 * @module exports the asteroid class
 */
module.exports = exports = {
    level1: level1,
    level2: level2
}

var asteroids = [];
var asteroidTypes = []
var axisList = [];
var asteroid1 = new Image();
asteroid1.src ='assets/c10008.png';
asteroidTypes.push(asteroid1);
var asteroid2 = new Image();
asteroid2.src = 'assets/c30008.png';
asteroidTypes.push(asteroid2);
var asteroid3 = new Image();
asteroid3.src = 'assets/c40009.png';
asteroidTypes.push(asteroid3);

/**
 * The first round of asteriods
 */
function level1(canvas) {
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
    return {asteroids: asteroids, axisList: axisList};
}

/**
 * The second round of asteriods
 */
function level2(canvas) {
    for(var i = 0; i < 15; i++) {
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
    return {asteroids: asteroids, axisList: axisList};
}

/**
 * The third round of asteriods
 */
function level3(canvas) {
    for(var i = 0; i < 20; i++) {
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
    return {asteroids: asteroids, axisList: axisList};
}