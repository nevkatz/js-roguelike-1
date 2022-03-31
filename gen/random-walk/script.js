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
      this.canvas = null;
      this.context = null;
      this.mapId = 0;
      this.drawing = true;
   }
}

var game = null;

const WALL_CODE = 0;
const FLOOR_CODE = 1;
const DIGGER_CODE = 2;

// the visible area
const VISIBILITY = 3;

// dimensions
const COLS = 80;
const ROWS = 60;
const TILE_DIM = 10;


const TILE_COLORS = [
   // wall
   'grey',
   // floor
   'white',
   // player
   'purple'
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
   el.innerHTML = `<label>${label}</label>: <span id="${id}">${value}</span>`
   container.appendChild(el);
   return container;
}

function createDOM() {

   let container = document.getElementById('container');

   let title = document.createElement('h3');

   title.textContent = 'Dungeon Algorithm Demo - Random Walk';

   container.appendChild(title);

   createHUD(container);
   createButton(container);

   // add canvas
   let canvas = document.createElement('canvas');
   canvas.id = 'grid';

   canvas.height = ROWS * TILE_DIM;
   canvas.width = COLS * TILE_DIM;

   container.appendChild(canvas);


}

function createHUD(container) {
   let hud = document.createElement('ul');
   hud.id = 'hud';

   let labels = ['Attempts', 'Tiles', 'Penalties', 'Tunnels'];

   for (var label of labels) {
      hud = addStat(label, hud);
   }
   container.appendChild(hud);
}

function createButton(container) {
   // create the button


   let btn = document.createElement('button');
   btn.className = 'toggle';
   btn.textContent = 'Create Map';

   container.appendChild(btn);

   btn.addEventListener('click', function() {
      game.mapId++;
      generateMap();
   });

   let btn2 = document.createElement('button');
   btn2.className = 'toggle';
   btn2.textContent = 'Reset Map';

   container.appendChild(btn2);

   btn2.addEventListener('click', function() {
      game.mapId++;
      resetMap(game.mapId);
   });
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
}
init();



/**
 * The generate map function
 * 
 * This algorithmm starts in the center and works its way outward.
 */
function resetMap(mapId) {

   game.map = [];
   for (var row = 0; row < ROWS; row++) {
      // create row
      game.map.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         game.map[row].push(WALL_CODE);
      }
   }
   drawMap(0, 0, COLS, ROWS, mapId);
}
async function generateMap() {

   let mapId = game.mapId;

   let pos = {
      x: COLS / 2,
      y: ROWS / 2
   };
   resetMap(mapId);

   const sleep = ms => new Promise(r => setTimeout(r, ms));

   const ATTEMPTS = 30000;
   const MAX_PENALTIES_COUNT = 1000;
   const MINIMUM_TILES_AMOUNT = 1000;
   const OUTER_LIMIT = 3;

   const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;

   let tiles = 0,
      penalties = 0,
      tunnels = 0,
      tp = 0;

 
   for (var i = 0; i < ATTEMPTS; i++) {


      if (mapId == game.mapId) {


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
               tp++;

               updateStats({
                  attempts: i,
                  tiles,
                  penalties: tp,
                  tunnels
               });

               if (penalties > MAX_PENALTIES_COUNT) {

                  // if we have used up our tiles, we're done.
                  if (tiles >= MINIMUM_TILES_AMOUNT) {
                     drawMap(0, 0, COLS, ROWS, mapId, 'penalty loop');
                     return;
                  }
                  // bring coords back to center
                  tunnels++;
                  updateStats({
                     attempts: i,
                     tiles,
                     penalties: tp,
                     tunnels
                  });


                  pos.x = COLS / 2;
                  pos.y = ROWS / 2;
               }
            }
         }

         let {
            x,
            y
         } = pos;

         // if not a floor, make this a floor
         if (game.map[y][x] != FLOOR_CODE) {
            

            game.map[y][x] = DIGGER_CODE;
            // we use up a tile.
            tiles++;

            let color = TILE_COLORS[DIGGER_CODE]
           
            drawObject(x, y, color, mapId)

            await sleep(10);

            updateStats({
               attempts: i,
               tiles,
               penalties: tp,
               tunnels
            });

            game.map[y][x] = FLOOR_CODE;

            color = TILE_COLORS[FLOOR_CODE];

            drawObject(x, y, color, mapId)

         }
         penalties = 0;
   } 
   updateStats({
      attempts: ATTEMPTS,
      tiles,
      penalties: tp,
      tunnels
   });
   return 'finished';
}

function updateStats(o) {

   for (var id in o) {
      let el = document.getElementById(id);
      el.textContent = o[id];
   }
}


/**
 *
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} endX
 * @param {Number} endY
 * 
 */
function drawMap(startX, startY, endX, endY, mapId, src) {

   if (mapId == game.mapId) {

    for (var row = startY; row < endY; row++) {

      for (var col = startX; col < endX; col++) {

         let color = null;

         // if shadow is on and the shadow is down....

         let c_idx = game.map[row][col];

         color = TILE_COLORS[c_idx];
   
         drawObject(col, row, color, mapId);

      } // end loop
    }
   }
}
/**
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 */
function drawObject(x, y, color, mapId) {

   if (game.mapId == mapId) {
      
       game.context.beginPath();
       game.context.rect(x * TILE_DIM, y * TILE_DIM, TILE_DIM, TILE_DIM);
       game.context.fillStyle = color;
       game.context.fill();
      //  game.context.clearRect(x * 10, y * 10, 10, 10);
   } 
}


// key down events