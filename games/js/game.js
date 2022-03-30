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

Game.prototype.inRoom = function({x,y}) {
   return this.rooms.find(r => r.encloses(x,y));
}

Game.prototype.addPath = function(path, id, src, tileCode) {
 
   for (var y = path.start.y; y <= path.end.y; ++y) {
      for (var x = path.start.x; x <= path.end.x; ++x) {
         game.map[y][x] = tileCode || FLOOR_CODE;
      }
   }
}

Game.prototype.resetMap = function() {

   this.map = [];
   // generate a solid wall.
   for (var row = 0; row < ROWS; row++) {
      // create row
      this.map.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         this.map[row].push(WALL_CODE);
      }
   }
}
Game.prototype.carveRoom = function(room) {

   for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {

         this.map[y][x] = FLOOR_CODE;
      }
   }
}



