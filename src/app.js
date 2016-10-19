"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Vector = require('./vector');
const Asteroid = require('./asteroid');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);

var lasers;
var explosion = new Audio();
explosion.src = 'assets/Explosion.wav';
var explosion2 = new Audio();
explosion2.src = 'assets/Explosion2.wav';
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas, lasers);


var background = new Image();
background.src = 'assets/bg5.png';

var axisList = [];
var asteroids = [];


var level1 = Asteroid.level1(canvas);
asteroids = level1.asteroids;
axisList = level1.axisList;

axisList.sort(function(a,b){return a.position.x - b.position.x});

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
    if(laser.position.x > canvas.width || laser.position.y > canvas.height || laser.position.x < 0 || laser.position.y < 0) {
      lasers.splice(lindex, 1);
    }
    else{
      asteroids.forEach(function(asteriod, aindex) {
        circle1 = {radius: laser.width / 2, x: laser.position.x + laser.width, y: laser.position.y + laser.width};
        circle2 = {radius: asteriod.width / 2, x: asteriod.position.x + asteriod.width, y: asteriod.position.y + asteriod.width};

        dx = circle1.x - circle2.x;
        dy = circle1.y - circle2.y;
        distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle1.radius + circle2.radius) {
            // collision detected!
            // Remove laser
            var ast;
            lasers.splice(lindex, 1);

            if(asteriod.width == 64) {
              var m = asteriod.mass / 2;
              asteriod.mass  = m;
              asteriod.width = 32;
              asteriod.height = 32;

              // Explosion add smaller asteriods
              ast = {
                asteriod: asteriod.asteriod,
                position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
                mass: m,
                velocity: { x: Math.random() * (2 + 2) - 2, y: Math.random() * (2 + 2) - 2 },
                width: 32,
                height: 32
              };
              asteroids.push(ast);
              axisList.push(ast);
              ast = {
                asteriod: asteriod.asteriod,
                position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
                mass: m,
                velocity: { x: Math.random() * (2 + 2) - 2, y: Math.random() * (2 + 2) - 2 },
                width: 32,
                height: 32
              };
              asteroids.push(ast);
              axisList.push(ast);
              axisList.sort(function(a,b){return a.position.x - b.position.x});
            }
            else if(asteriod.width == 32) {
              var m = asteriod.mass / 2;
              asteriod.mass  = m;
              asteriod.width = 16;
              asteriod.height = 16;

              // Explosion add smaller asteriods
              ast = {
                asteriod: asteriod.asteriod,
                position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
                mass: m,
                velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
                width: 16,
                height: 16
              };
              asteroids.push(ast);
              axisList.push(ast);

              ast = {
                asteriod: asteriod.asteriod,
                position: { x: asteriod.position.x + 15, y: asteriod.position.y + 15 },
                mass: m,
                velocity: { x: asteriod.velocity.x, y: asteriod.velocity.y },
                width: 16,
                height: 16
              };
              asteroids.push(ast);
              axisList.push(ast);
              axisList.sort(function(a,b){return a.position.x - b.position.x});
            }
            else if(asteriod.width == 16) {
              console.log("lenb: ", asteroids.length);
              asteroids.splice(aindex, 1);
              console.log("lena: ", asteroids.length);
            }
        }
      });// end asteriods
    }//end else
  });// end laser detection

  // asteroids.forEach(function(asteriod) {
  //   circle2 = {radius: 15, x: player.position.x, y: player.position.y};
  //   //console.log(circle1);
  //   circle1 = {radius: asteriod.width / 2, x: asteriod.position.x + asteriod.width, y: asteriod.position.y + asteriod.height};
  //   console.log("circle1.radius: ", circle1.radius, "circle2.radius: ", circle2.radius);

  //   dx = circle1.x - circle2.x;
  //   dy = circle1.y - circle2.y;
  //   console.log("dx: ", dx, "dy: ", dy);
  //   distance = Math.sqrt(dx * dx + dy * dy);
  //   console.log("distance: ", distance);
  //   //console.log(distance, circle1.radius + circle2.radius);
  //   if (distance < circle1.radius + circle2.radius) {
  //     game.pause = true;
  //   }
  // });


  // TODO: Update the game objects
  console.log("len: ", asteroids.length);
  if(asteroids.length == 31){
    asteroids = [];
    axisList = [];
    var level2 = Asteroid.level2(canvas);
    asteroids = level2.asteroids;
    axisList = level2.axisList;
  }
  if(asteroids.length == 91){
    asteroids = [];
    axisList = [];
    var level3 = Asteroid.level2(canvas);
    asteroids = level3.asteroids;
    axisList = level3.axisList;
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
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
  
  asteroids.forEach(function(asteriod) {
    ctx.drawImage(
        // Image
        asteriod.asteriod,
        // Source
        80, 50, 160, 160,
        // Destination
        asteriod.position.x, asteriod.position.y, asteriod.width, asteriod.height
    );
  });

  ctx.restore();
}
