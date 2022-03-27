
/**
 * 
 * Constants
 */ 

const DEBUG = false;

const COLS = 80;
const ROWS = 60;

const OUTER_LIMIT = 3;

const SHADOW_CODE = 0;
const VISIBLE_CODE = 1;

const WALL_CODE = 0;
const FLOOR_CODE = 1;




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

   
   directConnectCorner();



}
init();

function labelRooms() {
   game.context.fillStyle ='black';
   game.context.font = '15px Arial';
   game.rooms.forEach(function(room) {

     // let txt = `r${room.id} (${room.start.x},${room.start.y})`;

     let txt = `start: (${room.start.x},${room.start.y})`;

      let x = (room.start.x+1)*TILE_DIM;
  
      let y = room.center.y*TILE_DIM;
      
      game.context.fillText(txt, x, y);

      y+= 2*TILE_DIM;

      let end= `end: (${room.end.x},${room.end.y})`;

      game.context.fillText(end,x,y);
   });
}
function labelRoom(room, label, offset = 0, size=20) {
   game.context.fillStyle ='black';
   game.context.font = size + 'px Arial';

   let x = (room.start.x+1+offset)*TILE_DIM;
  
   let y = (room.center.y+1)*TILE_DIM;
      
   game.context.fillText(label, x, y);

}
function labelRoomsX() {
   game.context.fillStyle ='black';
   game.context.font = '15px Arial';
   game.rooms.forEach(function(room) {

    
      let txt = `start X: ${room.start.x}`;

      let x = (room.start.x+1)*TILE_DIM;
  
      let y = room.center.y*TILE_DIM;
      
      game.context.fillText(txt, x, y);

      y+= 2*TILE_DIM;

       let end= `end X: ${room.end.x}`;


      game.context.fillText(end,x,y);
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
function genDim() {
   const BASE_DIM = 6;
   const EXTRA = 3;

   let width, height;

   width = height = BASE_DIM;

   let additional = EXTRA; //Math.round(Math.random() * EXTRA);

   //let type = (Math.random() < 0.5) ? 'tall' : 'wide';

   let type = 'wide';
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
function setRoomCoords(center, width, height) {


   let halfW = Math.round(width / 2);
   let halfH = Math.round(height / 2);

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
   let { start, end } = setRoomCoords(center, width, height);

   let room = new Room(center, start, end);

   room.id = game.curRoomId;

   return room;

}
function genCenterCoord (maxCells, dim) {
      // get limit on either side based on outer limit and a room dimension - width or height
      let minDist = OUTER_LIMIT + Math.round(dim / 2);

      // get range based on cells in array - limit on either side.
      let range = maxCells - 2 * minDist;

      // get a random  number within 
      return minDist + Math.round(Math.random() * range);
}
function addRoom(c) {

   let { width, height } = genDim();

   let coords = c || {
      x: genCenterCoord(COLS, width),
      y: genCenterCoord(ROWS, height)
   }

   let room = generateRoom(coords, width, height);

   for (var gameRoom of game.rooms) {

      if (room.overlaps(gameRoom, 1)) {
         console.log('room overlaps');
         return null;
      }

   }

   game.curRoomId++;


   room.fillMap();

   game.rooms.push(room);
   return room;

}

/**
 * Generates a series of map rooms
 * 
 */


function generateMapRooms() {

   resetMap();

   let maxRooms = 100;

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
      
         let idx = game.map[row][col];

         let tileCode = TILE_COLORS[idx];
         
         drawObject(col, row, tileCode);

      } // end loop
   }
}
function drawBox(x,y,w,h,color,width) {
   game.context.globalAlpha = 1;
   game.context.beginPath();
   game.context.rect(x * TILE_DIM, y * TILE_DIM, w*TILE_DIM, h*TILE_DIM);
   game.context.strokeStyle = color;
   game.context.lineWidth = width || 4;
   game.context.stroke();

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
function labelTile(x, y, color) {

   //  game.context.clearRect(x * 10, y * 10, 10, 10);
   game.context.beginPath();
   game.context.rect(x * TILE_DIM+1, y * TILE_DIM+1, TILE_DIM-2, TILE_DIM-2);
   game.context.fillStyle = color;
   game.context.fill();
}