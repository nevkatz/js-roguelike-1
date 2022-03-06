/**
 * Classes 
 */

/**
 * Creates a new player. 
 * @class
 * 
 * @property {number} level - starts at one and progresses
 * @property {number} health - keep this above zero
 * @property {string} weapon - ties to an object with a damage rating
 * @property {object} coords - location on the grid
 * @property {number} xp - experience points
 */
class Player {
   constructor(level, health, weapon, coords, xp) {
      this.level = level;
      this.health = health;
      this.weapon = weapon;
      this.coords = coords;
      this.xp = xp;
   }
}

/**
 * Creates a new enemy. 
 * @class
 * 
 * @property {Number} health
 * @property {Object} coords
 * @property {Number} damage
 */
class Enemy {
   constructor(health, coords, damage) {
      this.health = health;
      this.coords = coords;
      this.damage = damage;
   }
}
/**
 * Creates a new game. 
 * @class
 * 
 * @property {Array} map - 2D array storing integer codes
 * @property {Array} shadow - 2D array holding a map of the shadow
 * @property {Boolean} isShadowToggled - is shadow on or off? 
 * @property {HTMLElement} canvas - the DOM element
 * @property {Object} context - the bundle of drawing methods tied to the canvas
 */
class Game {
   constructor() {

      this.map = [];
      this.shadow = [];
      this.rooms = [];

      this.isShadowToggled = false;

      this.enemies = [];
      this.canvas = null;

      this.context = null;
   }
}
/**
 * Reset all level-specific properties
 * 
 */
Game.prototype.reset = function() {
   this.enemies = [];
   this.shadow = [];
   this.map = [];
}

class Room {
   constructor(start, end, id) {
      this.start = start;
      this.end = end;
      this.id = id;
      this.doors = 0;
   }
}
/**
 * 
 * 
r1.end.x > r2.start.x && 
r1.start.x < r2.end.x &&

r1.end.y > r2.start.y && 
r1.start.y< r2.end.y

 */ 
Room.prototype.overlaps = function(room) {
  let test1 = this.end.x > room.start.x &&
                 this.start.x < room.end.x &&
                 this.end.y > room.start.y &&
                 this.start.y < room.end.y; 

  let test2  = room.end.x > this.start.x &&
               room.start.x < this.end.x &&
               room.end.y > this.start.y &&
               room.start.y < this.end.y;

   console.log('test1: ' + test1 + ' test2: ' + test2);

   return test1 || test2;
}
Room.prototype.inBounds = function() {

   return this.start.x > OUTER_LIMIT &&
          this.end.x < COLS - OUTER_LIMIT &&
          this.start.y > OUTER_LIMIT &&
          this.end.y < ROWS - OUTER_LIMIT;
}
Room.prototype.fillMap = function() {

   for (var y = this.start.y; y <= this.end.y; ++y) {
      for (var x = this.start.x; x <= this.end.x; ++x) {

         game.map[y][x] == FLOOR_CODE;
      }
   }
}
/**
 * Constants
 */
const WEAPONS = [{
      name: "Dagger",
      damage: 15
   },
   {
      name: "Sword",
      damage: 30
   },
   {
      name: "Hammer",
      damage: 60
   },
   {
      name: "Axe",
      damage: 100
   }
];

const SHADOW_CODE = 0;
const VISIBLE_CODE = 1;

const WALL_CODE = 0;
const FLOOR_CODE = 1;
const PLAYER_CODE = 2;
const ENEMY_CODE = 3;
const POTION_CODE = 4;
const WEAPON_CODE = 5;

const POTIONS = [10, 20, 30, 40, 50];

// possible health that enemies can have
const ENEMIES_HEALTH = [30, 30, 30, 30, 40, 40, 60, 80];

// possible damage that enemies can inflict
const ENEMIES_DAMAGE = [30, 30, 30, 30, 40, 40, 60, 80];

const POINTS_PER_LEVEL = 100;

// the visible area
const VISIBILITY = 3;

// dimensions
const COLS = 80;
const ROWS = 60;
const TILE_DIM = 10;



// total enemies
const TOTAL_ENEMIES = 10;
const STARTING_POTIONS_AMOUNT = 4;
const STARTING_WEAPONS_AMOUNT = 3;

const TILE_COLORS = [
        // wall
      'grey',
      // floor
      'white',
      // player
      'blue',
      // enemy
      'red',
      // health drop
      'green',
      // weapon
      'orange'
];

// game object

/**
 * 
 * @param {Sring} label - the visible label of the stat
 * @param {HTMLElement} container - the parent container we add it to
 */
function addStat(label, container) {
   let el = document.createElement('li');
   let id = label.toLowerCase();
   let value = '0';
   el.innerHTML = `<label>${label}</label>: <span id="${id}" ${value}></span>`
   container.appendChild(el);
   return container;
}

function createDOM() {

   let container = document.getElementById('container');

   let hud = document.createElement('ul');

   hud.id = 'hud';

   let labels = ['XP', 'Level', 'Health', 'Weapon', 'Damage', 'Enemies'];

   for (var label of labels) {
      hud = addStat(label, hud);
   }
   container.appendChild(hud);

   // add canvas
   let canvas = document.createElement('canvas');
   canvas.id = 'grid';



   canvas.height = ROWS * TILE_DIM;
   canvas.width = COLS * TILE_DIM;

   container.appendChild(canvas);

   // create the button
   let btn = document.createElement('button');
   btn.className = 'toggle';
   btn.textContent = 'Toggle Shadow';

   container.appendChild(btn);

   btn.addEventListener('click', toggleShadow);
}

function toggleShadow() {
   game.isShadowToggled = !game.isShadowToggled;
   drawMap(0, 0, COLS, ROWS);
}

/**
 *  HTML5 Canvas
 */
var game = null;
var player = null;

function init() {
   createDOM();
   game = new Game();
   game.canvas = document.getElementById("grid");
   game.context = game.canvas.getContext("2d");
   startGame();
   addKeyboardListener();

}
init();


/**
 * Start Game
 */


function startGame() {

   generateMap();

   setTimeout(gameSetUp, 1000);

   function gameSetUp() {
      generatePlayer();
      generateShadow();
      generateItems(STARTING_WEAPONS_AMOUNT, WEAPON_CODE);
      generateItems(STARTING_POTIONS_AMOUNT, POTION_CODE);
      generateEnemies(TOTAL_ENEMIES);
      drawMap(0, 0, COLS, ROWS);
      updateStats();
   }
}

/**
 * The generate map function
 * 
 * This algorithmm starts in the center and works its way outward.
 */
function generateMap() {
   // generate a solid wall.
   for (var row = 0; row < ROWS; row++) {
      // create row
      game.map.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         game.map[row].push(WALL_CODE);
      }
   }
   // set up total number of tiles used
   // and the total number of penalties made

   
   let pos = { 
      x:COLS/2,
      y:ROWS/2
   };

   const ATTEMPTS = 30000;
   const MAX_PENALTIES_COUNT = 1000;
   const MINIMUM_TILES_AMOUNT = 1000;
   const OUTER_LIMIT = 1;

   const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;

   let tiles = 0, penalties = 0;

   for (var i = 0; i < ATTEMPTS; i++) {

      // choose an axis to dig on.
      let axis = Math.random() <= 0.5 ? 'x' : 'y';

      // get the number of rows or columns, depending on the axis.
      let numCells = axis == 'x' ? COLS : ROWS;

      // choose the positive or negative direction.
      pos[axis] += randomDirection();

      // if we are on the far left or far right, find another value.

      // we don't want to dig here so let's find a way to get out
      while (pos[axis] < OUTER_LIMIT || pos[axis] >= numCells - OUTER_LIMIT) {

            pos[axis] += randomDirection();

            penalties++;

            if (penalties > MAX_PENALTIES_COUNT) {

               // if we have used up our tiles, we're done.
               if (tiles >= MINIMUM_TILES_AMOUNT) {
                  return;
               }
                  // bring coords back to center
               pos.x = COLS / 2;
               pos.y = ROWS / 2;
            }
      } 

      let {x, y} = pos;

      // if not a floor, make this a floor
      if (game.map[y][x] != FLOOR_CODE) {

         game.map[y][x] = FLOOR_CODE;
         // we use up a tile.
         tiles++;
      }
      penalties = 0;

   } // end the large loop
}

/**
 * @param {Number} quantity - the number of items to generate
 * @param {Number} tileCode - corresponds to a constant, such as POTION_CODE.
 *                            used to index into the TILE_COLORS array
 */ 
function generateItems(quantity, tileCode) {
   for (var i = 0; i < quantity; i++) {

      let coords = generateValidCoords();

      addObjToMap(coords, tileCode);

      if (!game.isShadowToggled || 
           game.shadow[coords.y][coords.x] == VISIBLE_CODE) {

         let color = TILE_COLORS[tileCode];
         drawObject(coords.x, coords.y, color);
      }
   }
}

/**
 * 
 * @TODO: Update so it's pure javaScript
 * use an array for the first three
 * use standalone functions for the others
 */
function updateStats() {

   let player_props = ['xp', 'level', 'health'];

   for (var prop of player_props) {
      let el = document.getElementById(prop);

      el.textContent = player[prop];
   }

   let weapon_props = [{
         domId: 'weapon',
         key: 'name',
      },
      {
         domId: 'damage',
         key: 'damage'
      }
   ];

   for (var prop of weapon_props) {

      let {domId,key} = prop;

      let el = document.getElementById(domId);

      el.textContent = player.weapon[key];
   }
   let enemyStats = document.querySelector("#enemies")

   enemyStats.textContent = game.enemies.length;
}


/**
 *
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} endX
 * @param {Number} endY
 * 
 */
function drawMap(startX, startY, endX, endY) {

   // loop through all cells of the map
   for (var row = startY; row < endY; row++) {

      for (var col = startX; col < endX; col++) {

         let color = null;

         // if shadow is on and the shadow is down....
         if (game.isShadowToggled && game.shadow[row][col] == SHADOW_CODE) {
            // simply draw black.
            color = 'black';

         } else {
            let c_idx = game.map[row][col];

            color = TILE_COLORS[c_idx];
         }
         drawObject(col, row, color);

      } // end loop
   }
}

/**
 * Coordinate Helper Functions
 */ 

function generateValidCoords() {

   var x, y;

   do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
   }
   while (game.map[y][x] != FLOOR_CODE);
 
   return {
      x: x,
      y: y
   };

}
function pickRandom(arr) {
   let idx = Math.floor(Math.random() * arr.length);

   return arr[idx];
}
/**
 * @param {Number} amount
 * 
 */
function generateEnemies(amount) {
   for (var i = 0; i < amount; i++) {
      // generate valid coordinates.
      let coords = generateValidCoords();

      let health = pickRandom(ENEMIES_HEALTH);

      let damage = pickRandom(ENEMIES_DAMAGE);

      let enemy = new Enemy(health, coords, damage);

      game.enemies.push(enemy);

      addObjToMap(coords, ENEMY_CODE);
   }
}

function generatePlayer() {
   var coords = generateValidCoords();

   // level, health, weapon, coords, xp
   player = new Player(1, 100, WEAPONS[0], coords, 30);

   addObjToMap(player.coords, PLAYER_CODE);
}

// add given coords to map 
// make the coords and neighbors busy
// and draw object with given color
function addObjToMap(coords, tileCode) {
   game.map[coords.y][coords.x] = tileCode;
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 */ 
function drawObject(x, y, color) {

 //  game.context.clearRect(x * 10, y * 10, 10, 10);
   game.context.beginPath();
   game.context.rect(x * TILE_DIM, y * TILE_DIM, TILE_DIM, TILE_DIM);
   game.context.fillStyle = color;
   game.context.fill();
}


// key down events
/**
 * 
 * @TODO: Lose the jQuery
 * https://stackoverflow.com/questions/26131686/trigger-keyboard-event-in-vanilla-javascript
 */
function addKeyboardListener() {
   document.addEventListener('keydown', function(e) {
      var x = player.coords.x;
      var y = player.coords.y;
      var oldX = player.coords.x;
      var oldY = player.coords.y;

      switch (e.which) {
         case 37: // left
            x--;
            break;
         case 38: // up
            y--;
            break;
         case 39: // right
            x++;
            break;
         case 40: // down
            y++;
            break;
         default:
            return; // exit this handler for other keys
      }
      // check if next spot is enemy
      if (game.map[y][x] == ENEMY_CODE) {

         const matching_coords = (enemy) => {
            return enemy.coords.x == x && enemy.coords.y == y;
         }
         let enemy = game.enemies.find(matching_coords);

         fightEnemy(enemy);
      } 
      else if (game.map[y][x] != WALL_CODE) {
         // if next spot is potion
         if (game.map[y][x] == POTION_CODE) {

            player.health += pickRandom(POTIONS);

            removeObjFromMap(x, y);
            generateItems(1, POTION_CODE);
         // if next spot is weapon
         } else if (game.map[y][x] == WEAPON_CODE) {

            player.weapon = pickRandom(WEAPONS);

            removeObjFromMap(x, y);
            generateItems(1, WEAPON_CODE);
         }
         // update player position
         updatePlayerPosition(player.coords.x, player.coords.y, x, y);

         updateStats();

         let left = oldX - VISIBILITY - 1;
         let top = oldY - VISIBILITY - 1;

         let right = x + VISIBILITY + 2;
         let bot = y + VISIBILITY + 2 ;

         drawMap(left, top, right, bot);
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
   });
}

function fightEnemy(enemy) {
   if (player.health - enemy.damage <= 0) {
      gameOver();
      return;
   }
   if (enemy.health - player.weapon.damage <= 0) {
      enemyDefeated(enemy);
   }
   else {
      enemy.health -= player.weapon.damage;
   }
   player.health -= enemy.damage;
   updateStats();
}

function enemyDefeated(enemy) {

   // remove enemy from  2D array
   removeObjFromMap(enemy.coords.x, enemy.coords.y);

   let left = enemy.coords.x - 1;
   let top = enemy.coords.y - 1
   let right = enemy.coords.x + 1;
   let bot = enemy.coords.y + 1;
   // remove ane enemy from the visible map.
   drawMap(left, top, right, bot);

   // add experience points
   player.xp += parseInt((enemy.damage + enemy.health)/2);

   // calculate the level in points. Level 1 has no experience so machine-wise it is level 0.
   let level_in_points = POINTS_PER_LEVEL * (player.level - 1)

   // level up if needed.
   if (player.xp - level_in_points >= POINTS_PER_LEVEL) {

      player.level++;
   }

   // remove enemy from enemies array
   let e_idx = game.enemies.indexOf(enemy);

   // remove enemy from array
   game.enemies.slice(e_idx, 1);


   // update stats
   updateStats();

   // if no enemies, user wins
   if (game.enemies.length == 0) {
      userWins();
   }
}



function userWins() {
   alert("YOU CONQUERED THE DUNGEON!");
   game.reset();
   startGame();
};

function gameOver() {
   alert("GAME OVER");
   game.reset();
   startGame();
};

function removeObjFromMap(x, y) {
   // make this a floor coordinate
   game.map[y][x] = FLOOR_CODE;
};


/**
 * Generates a shadow in the 2D array based on the player's position.
 */
function generateShadow() {


   let start = {}, end = {};

   let left_edge = player.coords.x - VISIBILITY;
   let top_edge = player.coords.y - VISIBILITY;

   start.x = left_edge < 0 ? 0 : left_edge;
   start.y = top_edge < 0 ? 0 : top_edge;

   let right_edge = player.coords.x + VISIBILITY;
   let bot_edge = player.coords.y + VISIBILITY;

   end.x = right_edge  >= COLS ? COLS - 1 : right_edge;
   end.y = bot_edge >= ROWS ? ROWS - 1 : bot_edge;

   // iterate through all squares on the map
   for (var row = 0; row < ROWS; row++) {
      game.shadow.push([]);
      for (var col = 0; col < COLS; col++) {
         // if this falls within visible region, push 1
         if (row >= start.y && row <= end.y && col >= start.x && col <= end.x) {
            game.shadow[row].push(VISIBLE_CODE);
            // else, push 0
         } else {
            game.shadow[row].push(SHADOW_CODE);
         }
      }
   }
}

/**
 * Removes old player square from map
 * Adds new square
 * resets shadow
 * @param {Number} oldX
 * @param {Number} oldY
 * @param {Number} newX
 * @param {Number} newY
 */
function updatePlayerPosition(oldX, oldY, newX, newY) {
   removeObjFromMap(oldX, oldY);

   // set this as the player
   game.map[newY][newX] = PLAYER_CODE;

   player.coords = {
      x: newX,
      y: newY
   };

   let start = {}, end = {};

   // if player is going right and down
   let old_left = oldX - VISIBILITY;  
   let old_top = oldY - VISIBILITY;

   start.x = old_left < 0 ? 0 : old_left;
   start.y = old_top < 0 ? 0 : old_top;

   let new_right = newX + VISIBILITY;
   let new_bot = newY + VISIBILITY;

   end.x = new_right >= COLS ? COLS - 1 : new_right;
   end.y = new_bot >= ROWS ? ROWS - 1 : new_bot;

   // if player is moving left
   if (oldX > newX) {
      // use newX rather than oldX as the left edge of the square.
      start.x = newX - VISIBILITY;
      // make sure to turn the right part of the square black
      // the right edge of the square is more to the right.
      end.x = oldX + VISIBILITY;
   }
   // if player is moving up
   if (oldY > newY) {
      // newY is less so it's better to use it than oldY
      // the top edge of the rendering area is higher
      // make sure that you re-render the squares that have to change above the player
      start.y = newY - VISIBILITY;
      // the bottom edge is lower
      end.y = oldY + VISIBILITY;
   }

   for (var row = start.y; row <= end.y; row++) {
      for (var col = start.x; col <= end.x; col++) {

         if (row >= newY - VISIBILITY &&
            row <= newY + VISIBILITY &&
            col >= newX - VISIBILITY &&
            col <= newX + VISIBILITY) {
            // show shadow
            game.shadow[row][col] = VISIBLE_CODE;
         } else {
            // no shadow
            game.shadow[row][col] = SHADOW_CODE;
         }
      }
   }
}