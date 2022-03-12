/**
 * @TODO: 
 * 
 * Swap in a rooms algorithmm
 * 
 * Add swipe logic
 * 
 * Add scrolling logic
 * 
 * For drawObject and drawMap, we need scrolling logic.
 * 
 * 
 * For scroll to work we probably need the player on a separate canvas. 
 * If shadow is on, redraw just the visible square
 * If whole map is visible, redraw the canvas that is visible in the viewport
 * May need to redraw the map if viewport changes, so perhaps keep that constant 
 * 
 * Include an "offset" variable in the map object.
 * 
 * If we are changing the viewport as we resize, then it actually makes sense to keep track of hte tile the player is on
 * and move the canvas based on the viewport
 * Otherwise the map has to be redrawn every time you want to change the viewport
 * 
 *
 */

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
      this.rooms = [];
      this.curRoomId = 0;

      this.map = [];
      this.shadow = [];

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

Game.prototype.inRoom = function({x,y}) {

   for (var room of this.rooms) {

      if (room.encloses(x,y)) {
         return true;
      }
   }
   return false;
}
/**
 * Rooms
 * 
 */

class Room {
   constructor(center, start, end) {

      this.center = center;
      // upper left
      this.start = start;
      // bottom right
      this.end = end;

      this.id = null;

      this.doors = 0;

      this.wall = 2;

      this.neighbors = [];


   }
}
Room.prototype.findRoom = function() {

   let rooms = this.findPossible();

   for (var room of rooms) {

      if (this.overlapsHoriz(room) || this.overlapsVert(room)) {
         return room;
      }
   }
   return null;

}

Room.prototype.findOverlapping = function() {

   let rooms  = this.findPossible();

   rooms = rooms.filter(room => this.overlapsHoriz(room) || this.overlapsVert(room));

   return rooms;

}
Room.prototype.isAdjacent = function(room) {

   let limit = 4;
   let horiz = (Math.abs(this.start.x - room.end.x) < limit || 

               Math.abs(this.end.x - room.start.x) < limit) &&
         
                this.overlapsVert(room);

   let vert =  (Math.abs(this.start.y - room.end.y) < limit ||
          
               Math.abs(this.end.y - room.start.y) < limit) &&

               this.overlapsHoriz(room);

   return horiz || vert;
}
Room.prototype.overlapsLeft = function(room, wall=0) {
          // the end is to the right of the other room's start
   return this.end.x + wall >= room.start.x &&
          // the start is to the left of hte other room's end
          this.start.x - wall <= room.end.x;

 /**
  * 
  * Here the doorLine of overlap is between other.start.x and this.end.x
  * 
  * this.start.x
  *   |
  *   *--------* <- this.end.x
  *   |  this  |
  *   *--------*
  *        *--------* <- room.end.x
  *        |  other |
  *        *--------*
  *        |
  *   room.start.x
  */
}
Room.prototype.overlapsRight = function(room, wall=0) {
   return  this.start.x - wall <= room.end.x &&
           this.end.x + wall >=  room.start.x;

 /**
  * 
  *          this.start.x
  *             |
  *             *--------* <- this.end.x
  *             |  this  |
  *             *--------*
  *       *--------* <- room.end.x
  *       |  other |
  *       *--------*
  *        |
  *  room.start.x
  */

}
Room.prototype.overlapsTop = function(room, wall=0) {
   return this.end.y + wall >= room.start.y &&
          this.start.y - wall <= room.end.y;

 /**
  *    *--------* <-- this.start.y
  *    |        | 
  *    |  this  |
  *    |        |    *---------* <- room.start.y
  *    |        |    |         |
  *    *--------*    |  other  |
  *                  |  room   |
  *    |             |         |  
  *  this.end.y      *---------* <- room.end.y
  */                 

}
Room.prototype.overlapsBot = function(room, wall=0) {

   return this.start.y <= room.end.y + wall  &&
          this.end.y >= room.start.y - wall;

 /**
  *    *--------* <-- room.start.y
  *    |        | 
  *    |  other |
  *    |  room  |    *---------* <- this.start.y
  *    |        |    |         |
  *    *--------*    |   this  |
  *    |             |         |  
  *  room.end.y      *---------* <- this.end.y
  */                 

}
// we need both a vertical or horizontal overlap.

Room.prototype.overlapsHoriz = function(room, wall=0) {
   return this.overlapsRight(room, wall) || this.overlapsLeft(room, wall);
}
Room.prototype.overlapsVert = function(room, wall=0) {
   return this.overlapsTop(room, wall) || this.overlapsBot(room, wall);
}
/**
 * Used to eliminate rooms.
 * 
 */ 
Room.prototype.overlaps = function(room, wall=0) {
   return this.overlapsHoriz(room, wall) && this.overlapsVert(room, wall);
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

         game.map[y][x] = FLOOR_CODE;
      }
   }
}


Room.prototype.getDoors = function(room) {
   let doors = {
      top: {
         x: this.center.x,
         y: this.start.y,
      },

      bot: {
         x: this.center.x,
         y: this.end.y
      },

      left: {
         x: this.start.x,
         y: this.center.y
      },

      right: {
         x: this.end.x,
         y: this.center.y
      }
   };
   return doors;
}
Room.prototype.contains = function(x, prop) {
   return x >= this.start[prop] && x <= this.end[prop];
}

Room.prototype.encloses = function(x,y) {
   return this.contains(x,'x') && this.contains(y,'y');
}

Room.prototype.below = function(room) {
   return this.start.y > room.start.y;
};

Room.prototype.above = function(room) {
   return this.start.y < room.start.y;
};

Room.prototype.onLeft = function(room) {
   return this.start.x < room.start.x;
}

Room.prototype.onRight = function(room) {
   return this.end.x > room.end.x;
}

Room.prototype.betweenHoriz = function(room1,room2) {

   let b = this.overlapsVert(room1) && this.overlapsVert(room2) &&
          ((this.center.x < room1.center.x && this.center.x > room2.center.x) ||
          (this.center.x < room2.center.x && this.center.x > room1.center.x));

   console.log(`${this.id} betweenHoriz => ${room1.id} and ${room2.id} => ${b}`);

   return b;
}
Room.prototype.betweenVert = function(room1,room2) {
   let b = this.overlapsHoriz(room1) && this.overlapsHoriz(room2) &&
         ((this.center.y < room1.center.y && this.center.y > room2.center.y) ||
          (this.center.y < room2.center.y && this.center.y > room1.center.y));

   console.log(`${this.id} betweenVert => ${room1.id} and ${room2.id} => ${b}`);
   console.log('betweenVert: ' + b);

   return b;

}

Room.prototype.roomBetween = function(room) {
   let testRooms = game.rooms.filter(x => x.id != this.id && x.id != room.id);
   for (var testRoom of testRooms) {

      if (testRoom.betweenVert(this,room) || testRoom.betweenHoriz(this,room)) {
         return true;
      }
   } 
   return false;
}
Room.prototype.connectRoom = function(room) {

   let success = false;
   this.neighbors.push(room);

   room.neighbors.push(this);

   const tolerance = -2;

   if (this.overlapsHoriz(room, tolerance) || this.overlapsVert(room,tolerance)) {
      console.log(`room${this.id} direct connecting with ${room.id}`);
      success = this.connectDirect(room, tolerance);
   }
   else {
      let vertCorner = {x:this.center.x,y:room.center.y};

      let horizCorner = {x:room.center.x, y:this.center.y};

      if (!game.inRoom(vertCorner)) {
         success = this.cornerVert(room, vertCorner);
      }
      else if (!game.inRoom(horizCorner)) {
         success = this.cornerHoriz(room, horizCorner);
      }
      else {
         console.log(`room${this.id} and room${room.id} cannot find a workable corner.`);
      }
   }
   return success;
}

Room.prototype.cornerVert = function(room, corner) {

   let horiz = null, vert = null;

      /**
       *  *--- room (onRight)
       *  |
       *  |
       * this
       */
      if (this.onLeft(room)) {
         horiz = {
            // start at corner
            start:corner,
            // and on left of this 
            end:{x:room.start.x,y:room.center.y}
         };
      }
      /**  
       *  room ---*
       *          |
       *         this
       */
      if (this.onRight(room)) {
           horiz = { 
             start:{x:room.end.x, y:room.center.y},
             end:corner,
           };
      }

      /**
       *    this
       *      |    
       *      *---room
       */ 
      if (this.above(room)) {
           vert = {
             // start at corner, go down
             start:{x:this.center.x,y:this.end.y},
             // end at top center of other room
             end:corner
           };
      }
      /**  
       *  room ---*
       *          |
       *         this
       */
      if (this.below(room)) {
          vert = {
            start:corner,
            end:{x:this.center.x, y:this.start.y},
          };
      }

      if (checkAdjacentVert(vert) && checkAdjacentHoriz(horiz)) {
           addPath(vert);
           addPath(horiz);

      }
      else {
          console.log('[cornerVert] there is another path right next to this one for ' + this.id + ' and ' + room.id);
          removeNeighbors(this,room);
          return false;
      }
    
  return true;
}

function removeNeighbors(room1,room2) {
    room1.neighbors.splice(room1.neighbors.indexOf(room2.id), 1);
    room2.neighbors.splice(room2.neighbors.indexOf(room1.id), 1);

}
Room.prototype.cornerHoriz = function(room, corner) {
   // assumes branches go out from sides.

   let horiz = null, vert = null;
   
      /**  
       *  this   ----*
       *             |
       *             |
       *            room
       */
      if (this.onLeft(room)) {
           horiz = { 
             start:{x:this.end.x, y:this.center.y},
             end:corner,
            };
      };
      /**
       *  *--- this (onRight)
       *  |
       *  |
       * room
       */
      if (this.onRight(room)) {
         horiz = {
            // start at corner
            start:corner,
            // and on left of this 
            end:{x:this.start.x,y:this.center.y}
         };
      }
      /**
       *    this---*
       *           |
       *          room
       * 
       */ 
      if (this.above(room)) {
           vert = {
             // start at corner, go down
             start:corner,
             // end at top center of other room
             end:{x:room.center.x, y:room.start.y}
           };
      }
      /*

      room                    room
      |                        |
      |                        |
      *----this        this----*
       */
      if (this.below(room)) {
          vert = {
            start:{x:room.center.x, y:room.end.y},
            end:corner
          };
      }
      if (checkAdjacentVert(vert) && checkAdjacentHoriz(horiz)) {
           addPath(vert);
           addPath(horiz);
      }
      else {
         console.log('[cornerHoriz] there is another path right next to this one for ' + this.id + ' and ' + room.id);
         removeNeighbors(this,room);
          return false;
      }
      return true;
}
Room.prototype.connectDirect = function(room, tolerance) {
   let found = false;
 let doorLine = {
      start:{
         x:0,
         y:0
      },
      end:{
         x:0,
         y:0
      }
   };

   let path = {
      start:{
         x:0,
         y:0
      },
      end:{
         x:0,
         y:0
      }
   };
   let limit = 1;
   if (this.overlapsHoriz(room, tolerance)) {

        if (Math.abs(this.start.x = room.start.x) < limit ||
            Math.abs(this.end.x - room.end.x) < limit) {
         console.log(this.id + ' and ' + room.id + ' are horiz aligned');

           doorLine.start.x = doorLine.end.x = this.center.x;
        }

        else if(this.overlapsLeft(room)) {
          doorLine.start.x = room.start.x;
          doorLine.end.x = this.end.x;
        }
        else if (this.overlapsRight(room)) {
          doorLine.start.x = this.start.x;
          doorLine.end.x = room.end.x;
        }
        else {
         console.log('should have horiz overlap but none for ' + this.id);
        }


        //path.start.x = path.end.x = Math.round((doorLine.start.x + doorLine.end.x)/2);
        if (this.above(room)) {
         path.start.y = this.end.y - 1;
         path.end.y = room.start.y + 1;
       }
       else {
 
         path.start.y = room.end.y -1;
         // our room is below so make this the end point
         path.end.y = this.start.y + 1;
       }

         for (var x = doorLine.start.x; x <= doorLine.end.x; ++x) {
           if (room.contains(x, 'x') && this.contains(x, 'x') && checkAdjacentVert(path,x)) {
            found = true;
            path.start.x = path.end.x = x;
           }
         }

        console.log('** path start x: ' + path.start.x);

     
       console.log('adding vert path from ' + this.id + ' to ' + room.id);
       console.log(`start: (${path.start.x},${path.start.y})`);
       console.log(`end: (${path.end.x},${path.end.y})`);

       if (found) {
          addPath(path, this.id);
       }
       else {
                  console.log('removing direct connect neighbors for ' + this.id + ' and ' + room.id);
           removeNeighbors(this,room);
          return false;
       }
     
   }
   else if (this.overlapsVert(room, tolerance)) {

       if (Math.abs(this.start.y - room.start.y) < limit ||
            Math.abs(this.end.y - room.end.y) < limit) {

           console.log(this.id + ' and ' + room.id + ' are vert aligned');

           doorLine.start.y = doorLine.end.y = this.center.y;
        }

       else if (this.overlapsTop(room)) {
          doorLine.start.y = room.start.y;
          doorLine.end.y = this.end.y;
       }
       else if (this.overlapsBot(room)) {
         doorLine.start.y = this.start.y;
         doorLine.end.y = room.end.y;
       }
       else {
         console.log('should have vert overlap but none for ' + this.id);
       }
       if (this.onLeft(room)) {
         path.start.x = this.end.x - 1;
         path.end.x = room.start.x + 1;
       }
       else {
 
         path.start.x = room.end.x - 1;
         // room is on the right
         path.end.x = this.start.x + 1;
       }

       console.log('adding horiz path from ' + this.id + ' to ' + room.id);
       console.log('doorLine y start: ' + doorLine.start.y + ' end: ' + doorLine.end.y);
      // path.start.y = path.end.y = Math.round((doorLine.start.y + doorLine.end.y)/2);
       console.log('path start y: ' + path.start.y);

       for (var y = doorLine.start.y; y <= doorLine.end.y; ++y) {
         if (room.contains(y, 'y') && this.contains(y, 'y') && checkAdjacentHoriz(path,y)) {
            path.start.y = path.end.y = y;
            found = true;
         }
       }
       if (found) {
         addPath(path, this.id);
       }
       else {
         console.log('removing direct connect neighbors for ' + this.id + ' and ' + room.id);
         removeNeighbors(this,room);
         return false;
       }
   }
   else {
      console.log('no overlap for ' + this.id);
   }

   
  return true;
}
function checkAdjacentVert(path, testX) {

   let score = 0;
   let limit = 5;

   let x = testX || path.start.x;
      for (var y = path.start.y; y <= path.end.y; ++y) {
         if (game.map[y][x-1] == FLOOR_CODE ||
             game.map[y][x+1] == FLOOR_CODE)
         score++;
      }
   return score < limit;
}

function checkAdjacentHoriz(path, testY) {
   let score = 0;
   let limit = 5;
   let y = testY || path.start.y;

      for (var x = path.start.x; x <= path.end.x; ++x) {
         if ((game.map[y-1] && game.map[y-1][x] == FLOOR_CODE) ||
             (game.map[y+1] && game.map[y+1][x] == FLOOR_CODE))
         
         score++;
      }
   return score < limit;
}

function addPath(path, id) {

   for (var y = path.start.y; y <= path.end.y; ++y) {
      for (var x = path.start.x; x <= path.end.x; ++x) {
         game.map[y][x] = FLOOR_CODE;
      }
   }
}




Room.prototype.buildHall_test = function(room) {
   /**
    *  
    * How to record which distance is the shortest distance between rooms?
    */
   let dist = {

      // vert
      top: Math.abs(this.start.y - room.end.y),
      bot: Math.abs(this.end.y - room.start.y),

      // horiz
      left: Math.abs(this.start.x - room.end.x),
      right: Math.abs(this.end.x - room.start.x)
   };

}
Room.prototype.findPossible = function() {
   let rooms = game.rooms.filter(x => x.id != this.id);
   let obj = this;
   
   // eliminate rooms that are already neighbors
   if (this.neighbors.length > 0) {
        rooms = rooms.filter(x => {
          let isNeighbor = obj.neighbors.find(neighbor => neighbor.id == x.id);
          return !isNeighbor;
         });
   }
   else {
      console.log(this.id + ' has no neighbors at this time...');
   }
   return rooms;
}
Room.prototype.nearestNeighbor = function() {

   let maxNeighbors = 4;
   let shortest = null,
      nearest = null;

   if (this.neighbors.length >= maxNeighbors) {
      return;
   }
   let rooms = this.findPossible();

   for (var room of rooms) {

      if (room.neighbors.length >= maxNeighbors) {
         console.log(`room${room.id} -- neighbors (${room.neighbors.length}) maxed out.`);
         continue;
      }

      let diffX = this.x - room.x;
      let diffY = this.y - room.y;
      let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
         if (!room.roomBetween(room) && (!shortest || dist < shortest || this.isAdjacent(room))) {

             shortest = dist;
             nearest = room;
         }
        
      //}
   }
   return nearest;
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

const OUTER_LIMIT = 3;

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

   generateMapRooms();

   setTimeout(gameSetUp, 1000);

   function gameSetUp() {
      generatePlayer();
      generateShadow();
     //  generateItems(STARTING_WEAPONS_AMOUNT, WEAPON_CODE);
     //  generateItems(STARTING_POTIONS_AMOUNT, POTION_CODE);
     //  generateEnemies(TOTAL_ENEMIES);
      drawMap(0, 0, COLS, ROWS);
      updateStats();
      labelRooms();
   }

}
function labelRooms() {
   game.context.fillStyle ='black';
   game.context.font = '20px Arial';
   for (var room of game.rooms) {
      console.log('labelling rooms');

      game.context.fillText("r" + room.id, room.center.x*TILE_DIM, room.center.y*TILE_DIM);
   }
}
   
function resetMap() {

   game.map = [];
   // generate a solid wall.
   for (var row = 0; row < ROWS; row++) {
      // create row
      game.map.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         game.map[row].push(WALL_CODE);
      }
   }

}

/**
 * Randomly generates a set of dimensions.
 * 
 */
function getDim() {
   const BASE_DIM = 6;
   const EXTRA = 5;

   let type = (Math.random() < 0.5) ? 'tall' : 'wide';

   let width, height;

   width = height = BASE_DIM;

   let additional = parseInt(Math.random() * EXTRA);

   if (type == 'tall') {
      height += additional;
   } else {
      width += additional;
   }
   return {
      width,
      height
   };
};

/**
 * 
 * @param {Object} center
 * @param {Number} height
 * @param {Number} width
 * 
 */
function setCoords(center, width, height) {


   let halfW = parseInt(width / 2);
   let halfH = parseInt(height / 2);

   let start = {
      x: center.x - halfW,
      y: center.y - halfH
   };

   let end = {
      x: center.x + halfW,
      y: center.y + halfH
   };

   return {
      start,
      end
   };
}
/**
 * Generates one room based on a center point.
 * @param {Object} center {x,y}
 */
function generateRoom(center, width, height) {



   // get coordinates based on width and height
   let { start, end} = setCoords(center, width, height);

   let room = new Room(center, start, end);

   room.id = game.curRoomId;
   game.curRoomId++;

   return room;

}

function addRoom(c) {
   const genCoord = (maxCells, dim) => {
      // get limit on either side based on outer limit and a room dimension - width or height
      let limit = OUTER_LIMIT + parseInt(dim / 2);

      // get range based on cells in array - limit on either side.
      let range = maxCells - 2 * limit;

      // get a random  number within 
      return limit + parseInt(Math.random() * range);
   }
   let {
      width,
      height
   } = getDim();

   let coords = c || {
      x: genCoord(COLS, width),
      y: genCoord(ROWS, height)
   }

   let room = generateRoom(coords, width, height);


   for (var gameRoom of game.rooms) {

      if (room.overlaps(gameRoom, 1)) {
         return false;
      }

   }


   room.fillMap();

   game.rooms.push(room);
   return true;

}

/**
 * Generates a series of map rooms
 * 
 */


function generateMapRooms() {

   resetMap();

   let center = {
      x: COLS / 2,
      y: ROWS / 2
   };

   addRoom(center);

   let maxRooms = 20;


   for (var i = 0; i < maxRooms; ++i) {
      addRoom();
   }

   let numRounds = 10;
   for (var j = 0; j < numRounds; ++j) {
    let myRooms = game.rooms.filter(x => x.neighbors.length == 0);
    for (var room of myRooms) {
      let neighbor = room.nearestNeighbor();
      let success = null;
      if (neighbor) {
         success = room.connectRoom(neighbor);
      }
      if (!success) {

         let rooms = room.findOverlapping();


         for (var newRoom of rooms) {

            success = room.connectRoom(newRoom);

            if (success) {
               break;
            }
         }

        /* let n = room.findRoom();

         if (n) {
            console.log('found overlapping froom for ' + room.id);
            room.connectRoom(n);
         }
         else {
            console.log('could not find overlapping room for ' + room.id);
         }*/

          
      }
         
         
    }
   }

   printNeighbors();
}

function printNeighbors() {
   for (var room of game.rooms) {
      let ids = room.neighbors.map(x => x.id);

      console.log(`room${room.id} neighbors: ${ids}`);
   }
}
/**
 * The generate map function
 * 
 * This algorithmm starts in the center and works its way outward.
 */
function generateMapTunnels() {

   // set up total number of tiles used
   // and the total number of penalties made
   resetMap();


   let pos = {
      x: COLS / 2,
      y: ROWS / 2
   };

   const ATTEMPTS = 30000;
   const MAX_PENALTIES_COUNT = 1000;
   const MINIMUM_TILES_AMOUNT = 1000;

   const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;

   let tiles = 0,
      penalties = 0;

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

      let {
         x,
         y
      } = pos;

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

      let {
         domId,
         key
      } = prop;

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

   let turns = 0,
      limit = 100;

   do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      turns++;
   }
   while (game.map[y][x] != FLOOR_CODE && turns < limit);

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

   // var coords = generateValidCoords();

   var coords = {
      x: COLS / 2,
      y: ROWS / 2
   };

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
      } else if (game.map[y][x] != WALL_CODE) {
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
         let bot = y + VISIBILITY + 2;

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
   } else {
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
   player.xp += parseInt((enemy.damage + enemy.health) / 2);

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


   let start = {},
      end = {};

   let left_edge = player.coords.x - VISIBILITY;
   let top_edge = player.coords.y - VISIBILITY;

   start.x = left_edge < 0 ? 0 : left_edge;
   start.y = top_edge < 0 ? 0 : top_edge;

   let right_edge = player.coords.x + VISIBILITY;
   let bot_edge = player.coords.y + VISIBILITY;

   end.x = right_edge >= COLS ? COLS - 1 : right_edge;
   end.y = bot_edge >= ROWS ? ROWS - 1 : bot_edge;

   // iterate through all squares on the map
   for (var row = 0; row < ROWS; row++) {
      game.shadow.push([]);
      for (var col = 0; col < COLS; col++) {
         // if this falls within visible doorLine, push 1
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

   let start = {},
      end = {};

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