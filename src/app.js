"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager');
const Player = require('./player.js');
const Asteroid = require('./asteroid');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 96);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);

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
  //entities.updateEntity(player);
  // asteroids.forEach(function(asteroid) {
  //   asteroid.update();
  //   //entities.updateEntity(asteroid);
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
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    // ctx.arc(100,75,50,0,2*Math.PI);
    ctx.arc(asteriod.position.x + 32, asteriod.position.y + 32, 32, 0, 2*Math.PI);
    ctx.stroke();
  });


}
