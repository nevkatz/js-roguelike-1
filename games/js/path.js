class Path {

   constructor(points = {}) {

      this.start = points.start || {
         x: 0,
         y: 0
      };

      this.end = points.end || {
         x: 0,
         y: 0
      };

      this.allowed = false;

   }
}
/**
 * @param {Number} testX
 */ 
Path.prototype.isAdjacentVert = function(testX) {

   const limit = 5;

   const x = testX || this.start.x;

   for (var diff of [-1, 1]) {

      let consecutive = 0;

      for (var y = this.start.y; y <= this.end.y; ++y) {

         if (game.map[y][x + diff] != WALL_CODE) {
            consecutive++;

            if (consecutive == limit) {
               return true;
            }

         } else {
            consecutive = 0;
         }
      }

   }
   return false;
}

Path.prototype.isAdjacentHoriz = function(testY) {

   const limit = 5;

   const y = testY || this.start.y;

   for (let diff of [-1, 1]) {

      let consecutive = 0;

      for (var x = this.start.x; x <= this.end.x; ++x) {

         if (game.map[y + diff] &&
            game.map[y + diff][x] != WALL_CODE) {

            consecutive++;

            if (consecutive == limit) {
               return true;
            }

         } else {
            consecutive = 0;
         }
      }
   }
   return false;
}