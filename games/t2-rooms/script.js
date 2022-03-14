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
   this.rooms = []
}

const OUTER_LIMIT = 3;

const SHADOW_CODE = 0;
const VISIBLE_CODE = 1;

const WALL_CODE = 0;
const FLOOR_CODE = 1;

const COLS = 80;
const ROWS = 60;
const TILE_DIM = 10;

const TILE_COLORS = [
   'grey',
   'white',
];
// game object

var game = null;

function createDOM() {

   let container = document.getElementById('container');


   // add canvas
   let canvas = document.createElement('canvas');
   canvas.id = 'grid';



   canvas.height = ROWS * TILE_DIM;
   canvas.width = COLS * TILE_DIM;

   container.appendChild(canvas);


}

/**
 *  HTML5 Canvas
 */



function init() {
   createDOM();
   game = new Game();
   game.canvas = document.getElementById("grid");
   game.context = game.canvas.getContext("2d");
   startGame();

}
init();


/**
 * Start Game
 */


function startGame() {

   generateMapRooms();

   setTimeout(gameSetUp, 1000);

   function gameSetUp() {
      drawMap(0, 0, COLS, ROWS);
      labelRooms();
   }

}
function labelRooms() {
   game.context.fillStyle ='black';
   game.context.font = '15px Arial';
   game.rooms.forEach(function(room) {
      let txt = `r${room.id} (${room.start.x},${room.start.y})`;
      game.context.fillText(txt, (room.start.x+1)*TILE_DIM, room.center.y*TILE_DIM);
   });
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
   let { start, end } = setCoords(center, width, height);

   let room = new Room(center, start, end);

   room.id = game.curRoomId;

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

   game.curRoomId++;


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

   let maxRooms = 10;

   for (var i = 0; i < maxRooms; ++i) {
      addRoom();
   }
}

/**
 *  CANVAS API functions.
 * 
 */ 
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

      
         let c_idx = game.map[row][col];

         color = TILE_COLORS[c_idx];
         
         drawObject(col, row, color);

      } // end loop
   }
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
