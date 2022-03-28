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

// already done
Room.prototype.fillMap = function() {

   for (var y = this.start.y; y <= this.end.y; ++y) {
      for (var x = this.start.x; x <= this.end.x; ++x) {

         game.map[y][x] = FLOOR_CODE;
      }
   }
}

/**
 *  Horiz overlap
 */ 
Room.prototype.overlapsHoriz = function(room, tolerance=0) {

   return this.start.x - tolerance <= room.end.x &&
           this.end.x + tolerance >= room.start.x;
}

Room.prototype.overlapsLeft = function(room, min) {

   return this.sharesCoordsWith(room,'x',min) && 
   this.center.x <= room.center.x;
}
Room.prototype.overlapsRight = function(room, min) {

   return this.shareCoordsWith(room,'x',min) && 
   this.center.x >= room.center.x;
}
Room.prototype.overlapsVert = function(room, tolerance=0) {

   return this.start.y - tolerance <= room.end.y &&
          this.end.y + tolerance >= room.start.y;
}
Room.prototype.overlapsTop = function(room, min=1) {

   return this.sharesCoordsWith(room,'y',min) && 
          this.center.y <= room.center.y;
}
Room.prototype.overlapsBot = function(room, min=1) {

   return this.sharesCoordsWith(room,'y',min) && 
          this.center.y >= room.center.y;
}
// already done? 
Room.prototype.contains = function(c, prop) {
   return c >= this.start[prop] && c <= this.end[prop];
}
Room.prototype.encloses = function(x,y) {
   return this.contains(x,'x') && this.contains(y,'y');
}
// already done? 
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
/**
 * @Tasks start here
 * 
 */ 
/**
 * @param {Object} room
 * @param {String} coord - x or y
 * @param {Number} min - the minimum number of coords/tiles that should be shared.
 * 
 */ 
Room.prototype.sharesCoordsWith = function(room, coord, min=1) {

 /** start
  * 
  * @TODO: Determine whether the nubmer of x or y coords are shared by two 
  *        rooms are greater than or equal to the minimum amount.
  * 
  * Should return a boolean value
  * 
  */ 

}


/**
 *  Vert overlap
 */ 


 /**
  * 
  * Here the doorTiles of overlap is between other.start.x and this.end.x
  * 
  * This.start.x always has to be less than or equal to than room.end.x. 
  * Here, it counts as an overlap. 
  * With overlapsRight, that means it's far away.
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



Room.prototype.alignedVert = function(room) {
   return this.center.y = room.center.y;
}
Room.prototype.alignedHoriz = function(room) {
   return this.center.x = room.center.x;
}

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






Room.prototype.horizDist = function(room) {
   return this.onLeft(room) ? room.start.x - this.end.x : this.start.x - room.end.x;
}
Room.prototype.vertDist = function(room) {
   return this.onTop(room) ? room.start.y - this.end.y : this.start.y - room.end.y;
}

Room.prototype.adjacentVert = function(room, limit) {
   return this.horizDist(room) < limit && this.sharesCoordsWith(room, 'y');
}

Room.prototype.adjacentHoriz = function(room, limit) {
   return this.vertDist(room) < limit && this.sharesCoordsWith(room, 'x');
}
Room.prototype.isAdjacent = function(room) {

   let limit = 4;

   return this.adjacentVert(room, limit) || this.adjacentHoriz(room, limit);
}
/**
 * @param {Number} min - the minimum number of x or y coordinates facing rooms should share.
 * @param {Number} maxRooms - the maximum # of ooms a room should connect with.
 */ 
Room.prototype.findFacingRooms = function(min=1, maxRooms=1) {

   let success = false;
   
   /**
    * @TODO: Write logic for connecting to one room that is facing the current
    * room. For a room to be facing, it should be sharing {min} x or y coordinates
    * and there should be no rooms in between.
    */ 
   return success;
   // filter out the closest neighbors
}
Room.prototype.searchNeighbors = function(room, arr) {
   /**
    * @TODO: Write a recursive function that populates an array
    * with the current room's neighbors and then calls itself on each neighbor, 
    * adding the resulting ones to the array.
    */ 

}
Room.prototype.connectRemaining = function() {

   /**
    * @TODO: Write logic that connects the remaining rooms in the network.
    */ 
}





Room.prototype.betweenHoriz = function(room1,room2) {

 /**
  *  @TODO: Write between logic
  */ 
}
Room.prototype.betweenVert = function(room1,room2) {

 /**
  *  @TODO: Write between logic
  */ 

}
Room.prototype.roomBetween = function(room) {
   /**
    * @TODO: Write between logic for testing whether there are any rooms
    *        that are between <this> and <room>
    */ 
}
Room.prototype.addNeighbor = function(room) {
   /**
    * @TODO: Write logic so that both rooms add each 
    *        other to their respective neighbors arrays
    */ 
}
/**
 * 
 * @param {Number} room - the other room object
 * @param {Number} min - the minimum number of common coordinates
 */ 
Room.prototype.connectRoom = function(room, min=3) {

   /**
    *  @TODO: Write connectRoom logic
    */ 
}

Room.prototype.cornerVert = function(room, corner) {

  /**
   *  @TODO: Write logic for creating two paths that meet at a corner
   * 
   *         The vertical path connects to the top or bottom 
   *         of the method-calling room
   */ 
}
Room.prototype.cornerHoriz = function(room, corner) {
  /**
   *  @TODO: Write logic for creating two paths that meet at a corner
   * 
   *         The horizontal path connects to the right or left side
   *         of the method-calling room
   */ 
 
}
/**
 * @TODO: Write a method that 
 */ 
Room.prototype.removeNeighbor = function(room) {
   /**
    * @TODO: Remove <room> from neighbors array in <this>
    *        Remove <this> from neighbors array in <room>
    */ 
}

/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedEdge = function(room,axis) {
   return this.start[axis] == room.start[axis] ||
          this.end[axis] == room.end[axis];
     
}

Room.prototype.getDoorTiles = function(room,axis,wall) {
   /**
    * @TODO: Write logic for getting possible tiles for the exit
    */ 

}
Room.prototype.placeDoorX = function(room,path,wall) {
   
   /**
    * @TODO: Write logic for finding a valid x-coordinate for a door
    */ 
}
Room.prototype.placeDoorY = function(room,path,wall) {
   
   /**
    * @TODO: Write logic for finding a valid y-coordinate for door
    */ 
}
Room.prototype.addVertPath = function(room, path, wall) {

   /**
    *  @TODO: Add vertical path between rooms.
    */ 

}
Room.prototype.addHorizPath = function(room, path, wall) {

   /**
    * @TODO: Add a horizontal path between rooms.
    */ 
}
Room.prototype.directConnect = function(room, min) {

 /**
  * @TODO: Connect to a room with a straight line.
  */ 
}
Room.prototype.findPotentialRooms = function() {
   /**
    * @TODO: Find potential rooms that do not include 
    *        the method-calling room or current neighbors.
    */ 
}
/**
 * @param {Object} myRoom
 * @param {Array} rooms
 */ 
Room.prototype.findNearbyRoom = function(myRoom, rooms) {
   /**
    * @TODO: Write a function that finds the first room in the 
    *        list that's available to connect.
    */ 
}
Room.prototype.nearestNeighbor = function() {

   /**
    * @TODO: Write a function that tries to find a nearby room using the 
    *        distance formula.
    */ 
}
