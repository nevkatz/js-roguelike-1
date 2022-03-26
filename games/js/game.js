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

   let inRoom = null;
   for (var room of this.rooms) {

      if (room.encloses(x,y)) {
         inRoom = room.id;
         break;
      }
   }
   console.log(`in room test of (${x},${y}): ` + inRoom);
   return inRoom;
}

Game.prototype.addPath = function(path, id, src, tileCode) {
 
   for (var y = path.start.y; y <= path.end.y; ++y) {
      for (var x = path.start.x; x <= path.end.x; ++x) {
         game.map[y][x] = tileCode || FLOOR_CODE;
      }
   }
}

