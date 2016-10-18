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

  // Check for collision between lasers and asteriods
  lasers.forEach(function(laser, lindex) {
    asteroids.forEach(function(asteriod, aindex) {
      var circle1 = {radius: laser.width / 2, x: laser.position.x + laser.width, y: laser.position.y + laser.width};
      var circle2 = {radius: asteriod.width / 2, x: asteriod.position.x + asteriod.width, y: asteriod.position.y + asteriod.width};

      var dx = circle1.x - circle2.x;
      var dy = circle1.y - circle2.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < circle1.radius + circle2.radius) {
          // collision detected!
          // Remove laser
          lasers.splice(lindex, 1);

          if(asteriod.width == 64) {
            var m = asteriod.mass / 2;
            asteriod.mass  = m;
            asteriod.width = 32;
            asteriod.height = 32;

            // Explosion add smaller asteriods
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: Math.random() * (2 + 2) - 2, y: Math.random() * (2 + 2) - 2 },
              width: 32,
              height: 32
            });
            asteroids.push({
              asteriod: asteriod.asteriod,
              position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
              mass: m,
              velocity: { x: Math.random() * (2 + 2) - 2, y: Math.random() * (2 + 2) - 2 },
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

            // Explosion add smaller asteriods
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
          else if(asteriod.width == 16) {
            asteroids.splice(aindex, 1);
          }
      }
    });// end asteriods
  });// end laser detection

  asteroids.forEach(function(asteriod) {
    circle1 = {radius: player.width / 2, x: player.position.x + player.width, y: player.position.y + player.width};
    circle2 = {radius: asteriod.width / 2, x: asteriod.position.x + asteriod.width, y: asteriod.position.y + asteriod.width};

    dx = circle1.x - circle2.x;
    dy = circle1.y - circle2.y;
    distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < circle1.radius + circle2.radius) {
      game.
    }
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
