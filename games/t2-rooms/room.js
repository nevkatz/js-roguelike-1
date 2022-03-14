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

      this.neighbors = [];
   }
}
Room.prototype.fillMap = function() {

   for (var y = this.start.y; y <= this.end.y; ++y) {
      for (var x = this.start.x; x <= this.end.x; ++x) {

         game.map[y][x] = FLOOR_CODE;
      }
   }
}
// we need both a vertical or horizontal overlap.

Room.prototype.overlapsHoriz = function(room, wall=0) {
   return this.overlapsRight(room, wall) || this.overlapsLeft(room, wall);
}
Room.prototype.overlapsVert = function(room, wall=0) {
   return this.overlapsTop(room, wall) || this.overlapsBot(room, wall);
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

/**
 * Used to eliminate rooms.
 * 
 */ 
Room.prototype.overlaps = function(room, wall=0) {
   return this.overlapsHoriz(room, wall) && this.overlapsVert(room, wall);
}