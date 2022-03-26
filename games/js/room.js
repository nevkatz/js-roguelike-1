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
/**
 *  Horiz overlap
 */ 
Room.prototype.overlapsHoriz = function(room, tolerance=0) {

   return this.start.x - tolerance <= room.end.x &&
           this.end.x + tolerance >= room.start.x;
}
Room.prototype.overlapsLeft = function(room, tolerance=0) {

   return this.overlapsHoriz && this.center.x <= room.center.x;
}
Room.prototype.overlapsRight = function(room, tolerance=0) {

   return this.overlapsHoriz && this.center.x >= room.center.x;
}

/**
 *  Vert overlap
 */ 
Room.prototype.overlapsVert = function(room, tolerance=0) {

   return this.start.y - tolerance <= room.end.y &&
          this.end.y + tolerance >= room.start.y;
}
Room.prototype.overlapsTop = function(room, tolerance=0) {

   return this.overlapsVert(room) && this.center.y <= room.center.y;
}
Room.prototype.overlapsBot = function(room, tolerance=0) {

   return this.overlapsVert(room) && this.center.y >= room.center.y;
}

 /**
  * 
  * Here the doorLine of overlap is between other.start.x and this.end.x
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





/**
 *  Used
 */ 
Room.prototype.findOverlapping = function() {

   let rooms  = this.findPotentialRooms();

   rooms = rooms.filter(room => this.overlapsHoriz(room) || this.overlapsVert(room));

   return rooms;
}
Room.prototype.horizDist = function(room) {
   return this.onLeft(room) ? room.start.x - this.end.x : this.start.x - room.end.x;
}
Room.prototype.vertDist = function(room) {
   return this.onTop(room) ? room.start.y - this.end.y : this.start.y - room.end.y;
}

Room.prototype.adjacentVert = function(room, limit) {
   return this.horizDist(room) < limit && this.overlapsVert(room);
}

Room.prototype.adjacentHoriz = function(room, limit) {
   return this.vertDist(room) < limit && this.overlapsHoriz(room);
}
Room.prototype.isAdjacent = function(room) {

   let limit = 4;

   return this.adjacentVert(room, limit) || this.adjacentHoriz(room, limit);
}
Room.prototype.findFacingRooms = function(tolerance=0, maxRooms=1) {

  // console.log(`Room${this.id} findFacing with tolerance ` + tolerance);
   let rooms = this.findPotentialRooms();
   let success = false;

   for (var room of rooms) {

      if ((this.overlapsHoriz(room,tolerance) && !this.roomBetween(room)) ||

          (this.overlapsVert(room, tolerance) && !this.roomBetween(room))) {


         this.connectRoom(room, tolerance);
         successs = true;
         //neighbors.horiz.push({room,dist});

      }
      if (this.neighbors.length >= maxRooms) {

         break;
      }
   }
  // console.log(this.neighbors.length + ' neighbors for ' + this.id + ' after findFacingRooms..');
   return success;
   // filter out the closest neighbors
}
Room.prototype.searchNeighbors = function(room, arr) {
   for (var room of room.neighbors) {

      if (!arr.includes(room)) {
  
         arr.push(room);

         arr = this.searchNeighbors(room, arr);
      } 
   }
   return arr;

}
Room.prototype.connectRemaining = function() {

   let rooms = this.findPotentialRooms();
   let connectedRooms = [];

   connectedRooms = this.searchNeighbors(this,connectedRooms);
   let connectedRoomIds = connectedRooms.map(x => x.id);


   let disconnected = rooms.filter(x => !connectedRoomIds.includes(x.id));

   for (var room of disconnected) {

      let success = this.findNearbyRoom(room, connectedRooms);
      console.log(`Remaining room${room.id} success: ${success}`);

    }

    return;
}


/**
 * Used to eliminate rooms.
 * 
 */ 
Room.prototype.overlaps = function(room, tolerance=0) {
  // console.log(`Room${this.id} overlaps tolerance: ${tolerance}`);
   return this.overlapsHoriz(room, tolerance) && this.overlapsVert(room, tolerance);
}


Room.prototype.fillMap = function() {

   for (var y = this.start.y; y <= this.end.y; ++y) {
      for (var x = this.start.x; x <= this.end.x; ++x) {

         game.map[y][x] = FLOOR_CODE;
      }
   }
}


Room.prototype.contains = function(x, prop, buffer=0) {
   return x >= this.start[prop] + buffer && x <= this.end[prop] - buffer;
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


   return b;
}
Room.prototype.betweenVert = function(room1,room2) {

   let b = this.overlapsHoriz(room1) && this.overlapsHoriz(room2) &&
         ((this.center.y < room1.center.y && this.center.y > room2.center.y) ||
          (this.center.y < room2.center.y && this.center.y > room1.center.y));

   return b;

}
Room.prototype.roomBetween = function(room) {
   let testRooms = game.rooms.filter(x => x.id != this.id && x.id != room.id);
   for (var testRoom of testRooms) {

      if (testRoom.betweenVert(this,room) || 
          testRoom.betweenHoriz(this,room)) {

         return true;
      }
   } 
   return false;
}
Room.prototype.connectRoom = function(room, tolerance=-2) {

   let success = false;
   this.neighbors.push(room);

   room.neighbors.push(this);

   //console.log('connectRoom with tolerance: ' + tolerance);

   if (this.overlapsHoriz(room, tolerance) || this.overlapsVert(room,tolerance)) {

     
      success = this.connectDirect(room, tolerance);
   }
   else {
      // if we add doorLine logic we need to mix in the inRoom
      // so it can'b be adjacent and it can't be in a room.
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

   console.log(`room${this.id} is using cornerVert to connect with room${room.id}`);

   let horiz = new Path(), vert = new Path();

      /**
       *  *--- room (onRight)
       *  |
       *  |
       * this
       */
      if (this.onLeft(room)) {

         horiz.start = corner;

         horiz.end = {x:room.start.x - 1, y:room.center.y};
 
      }
      /**  
       * 
       * If on right, start horizontal path from the room on left.
       * End the horizontal path at this room's center.
       *  room ---*
       *          |
       *         this
       */
      if (this.onRight(room)) {

           horiz.start = {x:room.end.x + 1, y:room.center.y};
           horiz.end = corner;
     
      }

      /**
       *    this
       *      |    
       *      *---room
       */ 
      if (this.above(room)) {
           vert.start = {x:this.center.x, y:this.end.y + 1};
             // end at top center of other room
           vert.end = corner;
      }
      /**  
       * 
       * Here we are drawing downwards from the other room's vertical center
       * to this room's top edge and horizontal center.
       *  room ---*
       *          |
       *         this
       */
      if (this.below(room))  {
          vert.start = corner;

          vert.end = {x:this.center.x, y:this.start.y - 1};
      }

      let tileCode = DEBUG ? WEAPON_CODE : FLOOR_CODE;

      if (!vert.isAdjacentVert(null, 'corner') && !horiz.isAdjacentHoriz(null,'corner')) {
           game.addPath(vert,null, null, tileCode);
           game.addPath(horiz,null, null, tileCode);
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

   console.log(`room${this.id} is using cornerHoriz to connect with room${room.id}`);
   // assumes branches go out from sides.

   let horiz = new Path(), vert = new Path;
   
      /**  
       *  this  ----*
       *            |
       *            |
       *          room
       */
      if (this.onLeft(room)) {
         horiz.start = {x:this.end.x + 1,y:this.center.y},
         horiz.end = corner
      }
      /**
       *  *--- this (onRight)
       *  |
       *  |
       * room
       */
      if (this.onRight(room)) {
         horiz.start  = corner,
         horiz.end = {x:this.start.x - 1,y:this.center.y}
 
      }
      /**
       *    this---*
       *           |
       *          room
       * 
       */ 
      if (this.above(room)) {
           vert.start = corner,
             // end at top center of other room
           vert.end = {x:room.center.x, y:room.start.y - 1}
    
      }
      /*

      room                    room
      |                        |
      |                        |
      *----this        this----*
       */
      if (this.below(room)) {
          vert.start = {x:room.center.x, y:room.end.y + 1},
          vert.end = corner
      }

      if (!vert.isAdjacentVert(null, 'corner') && !horiz.isAdjacentHoriz(null, 'corner')) {

           let tileCode = DEBUG ? WEAPON_CODE : FLOOR_CODE;

           game.addPath(vert, null, null, tileCode);
           game.addPath(horiz, null, null, tileCode);
      }
      else {
         console.log('[cornerHoriz] there is another path right next to this one for ' + this.id + ' and ' + room.id);
         removeNeighbors(this,room);
          return false;
      }
      return true;
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
/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedEdges = function(room,axis) {
   return this.start[axis] == room.start[axis] &&
          this.end[axis] == room.end[axis];
     
}
/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedCenters = function(room,axis) {
   return this.center[axis] == room.centers[axis];
}
Room.prototype.getDoorLine = function(room,axis,wall) {
   let doorLine = new Path();


   doorLine.start[axis] = Math.max(this.start[axis] + wall, room.start[axis] + wall);

   doorLine.end[axis] = Math.min(this.end[axis] - wall, room.end[axis] - wall);


   return doorLine;

}
Room.prototype.placeDoorX = function(room,path,wall) {
   
   let doorLine = this.getDoorLine(room,'x',wall);

   for (var x = doorLine.start.x; x <= doorLine.end.x; ++x) {

         // add inRoom logic for corners? 
         if (!path.isAdjacentVert(x)) {
               path.allowed = true;
               path.start.x = path.end.x = x;
               console.log('Room'+this.id+' -- path is good at '+x);
               break;
         }
         else {
              console.log('Room'+this.id+' -- path is bad at '+x);
         }
   }
   return doorLine;
}
Room.prototype.placeDoorY = function(room,path,wall) {
   
   let doorLine = this.getDoorLine(room,'y', wall);

   for (var y = doorLine.start.y; y <= doorLine.end.y; ++y) {

         if (!path.isAdjacentHoriz(y)) {
              console.log('Room'+this.id+' -- path is good at '+y);
               path.allowed = true;
               path.start.y = path.end.y = y;
               break;
         
         }
         else {
            console.log('Room'+this.id+' -- path is bad '+y);
         }
   }
   console.log('Room'+this.id+' path y: ' + path.start.y + ' allowed: ' + path.allowed);

   return path;
}
Room.prototype.addVertPath = function(room, path, wall) {

       // use the bottom of whatever room is above
   path.start.y = Math.min(this.end.y,room.end.y) + 1;
          // use the top of whatever room is below.

   path.end.y = Math.max(this.start.y,room.start.y) - 1;

   let tileCode = FLOOR_CODE;

   // this could be taken out if we want to simplify the tutorial.
   if (room.contains(this.center.x,'x',wall) && !path.isAdjacentVert(this.center.x)) {
     
           path.start.x = path.end.x = this.center.x;

           path.allowed = true;

           if (DEBUG) { tileCode = PLAYER_CODE; }
   }
   else {
           path = this.placeDoorX(room,path,wall);
   }   

   if (path.allowed) {
         // console.log('Room '+this.id+' starty : ' + path.start.y + ' end y: ' + path.end.y);

          game.addPath(path, this.id, 'addVertPath',tileCode);
   }
   else {

          removeNeighbors(this,room);
   }
   return path;

}
Room.prototype.addHorizPath = function(room, path, wall) {

   // the preference is to use the center.
   // this could be taken out if we want to simplify the tutorial.
   // we can add this in a different article on prioritizing center doors.

   path.start.x = Math.min(this.end.x,room.end.x) + 1;

   // use the left side of whatever room is on the right
   path.end.x = Math.max(this.start.x,room.start.x) - 1;

   let tileCode = FLOOR_CODE;

   // choose on center....
   if (room.contains(this.center.y,'y',wall) && !path.isAdjacentHoriz(this.center.y)) {
     
           path.start.y = path.end.y = this.center.y;

           path.allowed = true;

          if (DEBUG) { tileCode = POTION_CODE };

   }
   else {
           path = this.placeDoorY(room,path,wall);
   }   

   if (path.allowed) {
          // use the right of whatever room is on the left

          game.addPath(path, this.id, 'addHorizPath', tileCode);
   }
   else {

         removeNeighbors(this,room);
   
   }
   return path;

}
Room.prototype.connectDirect = function(room, tolerance) {

 let path = new Path();
 
 // convert tolerance to a wall value
 let wall = 1;


 if (this.overlapsHoriz(room, tolerance)) {
      path = this.addVertPath(room,path,wall);
     
 }
 else {
      path = this.addHorizPath(room,path,wall);
 }

// console.log('path allowed: ' + path.allowed);
 //console.log(path);
// console.log(game.map);
  return path.allowed;
}
Room.prototype.findPotentialRooms = function() {
   let rooms = game.rooms.filter(x => x.id != this.id);
   
   if (this.neighbors.length > 0) {
        rooms = rooms.filter(x => !this.neighbors.includes(x));
   }
   else {
      console.log(this.id + ' has no neighbors at this time...');
   }
   //console.log(this.id + ' neighbors: '+this.neighbors.map(x => x.id)+' potential rooms: ' + rooms.map(x=>x.id));
   return rooms;
}
Room.prototype.findNearest = function(myRoom, rooms) {
   let shortest = null;
   let nearestRoom = null;

   for (var room of rooms) {
   //   console.log('type of room in findNearest: ' + typeof(room));
      let diffX = myRoom.x - room.x;
      let diffY = myRoom.y - room.y;

      let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

      console.log(myRoom.id + ' has a room between ' + room.id + ': ' + myRoom.roomBetween(room));

      if (!myRoom.roomBetween(room) && (!shortest || dist < shortest)) {
         shortest = dist;
         nearestRoom = room;
      }
   }
   return nearestRoom;
}
Room.prototype.findNearbyRoom = function(myRoom, rooms) {
   let shortest = null;
   let nearestRoom = null;


   for (var room of rooms) {
      
      if (!myRoom.roomBetween(room)) {
        
         let success = myRoom.connectRoom(room);

        // console.log('tried to connect Room' + room.id + ' to Room' + myRoom.id + '. Success: ' + success);
         
         if (success) {
            return true;
         }
         
      }
   }
   return false;
}
Room.prototype.nearestNeighbor = function() {

   let maxNeighbors = 4;
   let shortest = null,
      nearestRoom = null;

   let rooms = this.findPotentialRooms();

   for (var room of rooms) {

      let diffX = this.x - room.x;
      let diffY = this.y - room.y;

      let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      if (!this.roomBetween(room) && (!shortest || dist < shortest || this.isAdjacent(room))) {

             shortest = dist;
             nearestRoom = room;
      }
        
      //}
   }
   return nearestRoom;
}
