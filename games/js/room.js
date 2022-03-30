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

/**
 * @param {Object} room
 * @param {String} coord - x or y
 * @param {Number} min - the minimum number of coords/tiles that should be shared.
 * 
 */ 
Room.prototype.sharesCoordsWith = function(room, coord, min=1) {

   return room.end[coord] - this.start[coord] >= min &&
           this.end[coord] - room.start[coord] >= min;


}

/**
 *  Vert overlap
 */ 
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
   
   let rooms = this.findPotentialRooms();

   for (var room of rooms) {

      if (!this.roomBetween(room) && 

         (this.sharesCoordsWith(room,'x', min) || 
          this.sharesCoordsWith(room,'y', min))) {

          success = this.connectRoom(room, min);

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
   let numConnected = 0;

   connectedRooms = this.searchNeighbors(this,connectedRooms);
   let connectedRoomIds = connectedRooms.map(x => x.id);


   let disconnected = rooms.filter(x => !connectedRoomIds.includes(x.id));

   for (var room of disconnected) {

      let success = this.findNearbyRoom(room, connectedRooms);
      console.log(`Remaining room${room.id} success: ${success}`);
      //debug
      if (success) {
         numConnected++;
      }

    }
    return {numConnected, numDisc:disconnected.length};
}


/**
 * Used to eliminate rooms.
 * 
 */ 
Room.prototype.overlaps = function(room, tolerance=0) {
  // console.log(`Room${this.id} overlaps tolerance: ${tolerance}`);
   return this.overlapsHoriz(room, tolerance) && this.overlapsVert(room, tolerance);
}


Room.prototype.contains = function(c, prop) {
   return c >= this.start[prop] && c <= this.end[prop];
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

  return this.sharesCoordsWith(room1,'y') && 
         this.sharesCoordsWith(room2,'y') &&
         room1.sharesCoordsWith(room2,'y') &&

          ((this.center.x > room1.center.x && this.center.x < room2.center.x) ||
          (this.center.x > room2.center.x && this.center.x < room1.center.x));
}
Room.prototype.betweenVert = function(room1,room2) {

   return this.sharesCoordsWith(room1,'x') && 
           this.sharesCoordsWith(room2,'x') &&
           room1.sharesCoordsWith(room2,'x') &&
         ((this.center.y > room1.center.y && this.center.y < room2.center.y) ||
          (this.center.y > room2.center.y && this.center.y < room1.center.y));

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
Room.prototype.addNeighbor = function(room) {
   this.neighbors.push(room);
   room.neighbors.push(this);
}
/**
 * 
 * @param {Number} room - the other room object
 * 
 * @param {Number} min - the minimum number of common coordinates
 */ 
Room.prototype.connectRoom = function(room, min=3) {

   let success = false;

   if (this.sharesCoordsWith(room, 'x', min) || 
       this.sharesCoordsWith(room, 'y', min)) {

      success = this.directConnect(room, min);

   }
   
   if (!success) {
      // if we add doorTiles logic we need to mix in the inRoom
      // so it can'b be adjacent and it can't be in a room.
      let vertCorner = {x:this.center.x,y:room.center.y};

      let horizCorner = {x:room.center.x, y:this.center.y};

      let vert = Math.random() < 0.5;

      if ((vert || game.inRoom(horizCorner)) && !game.inRoom(vertCorner)) {
         success = this.cornerVert(room, vertCorner);
      }
      if (!success && !game.inRoom(horizCorner)) {
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

      let tileCode = DEBUG ? ITEM_CODE : FLOOR_CODE;

      if (!vert.isAdjacentVert(null, 'corner') && !horiz.isAdjacentHoriz(null,'corner')) {
           game.addPath(vert,null, null, tileCode);
           game.addPath(horiz,null, null, tileCode);

           this.addNeighbor(room);
      }
    
  return this.neighbors.includes(room);
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

           let tileCode = DEBUG ? SPELL_CODE : FLOOR_CODE;

           game.addPath(vert, null, null, tileCode);
           game.addPath(horiz, null, null, tileCode);
           this.addNeighbor(room);
      }
      return this.neighbors.includes(room);
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
Room.prototype.possibleExits = function(room,axis,wall) {
 
   let start = Math.max(this.start[axis] + wall, room.start[axis] + wall);

   let end = Math.min(this.end[axis] - wall, room.end[axis] - wall);

   return {start, end};

}
Room.prototype.placePathX = function(room,path,wall) {
   
   let {start, end} = this.possibleExits(room,'x',wall);

   for (var x = start; x <= end; ++x) {

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
   return path;
}
Room.prototype.placePathY = function(room,path,wall) {
   
   let {start, end} = this.possibleExits(room,'y', wall);

   for (var y = start; y <= end; ++y) {

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

   path.start.y = Math.min(this.end.y,room.end.y) + 1;

   path.end.y = Math.max(this.start.y,room.start.y) - 1;

   let tileCode = FLOOR_CODE;

   path = this.placePathX(room,path,wall);
 
   if (path.allowed) {
         // console.log('Room '+this.id+' starty : ' + path.start.y + ' end y: ' + path.end.y);

          game.addPath(path, this.id, 'addVertPath',tileCode);

          this.addNeighbor(room);
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

 
   path = this.placePathY(room,path,wall);
  

   if (path.allowed) {

          game.addPath(path, this.id, 'addHorizPath', tileCode);

          this.addNeighbor(room);
   }
   return path;

}
Room.prototype.directConnect = function(room, min) {

 let path = new Path();
 
 const wall = parseInt((min-1)/2);

 if (this.sharesCoordsWith(room, 'x', min)) {

      path = this.addVertPath(room,path,wall);  
 }
 else {
      path = this.addHorizPath(room,path,wall);
 }

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

/**
 * Find the first room in the list you can connect with.
 */ 
Room.prototype.findNearbyRoom = function(myRoom, rooms) {
   let shortest = null;
   let nearestRoom = null;

   for (var room of rooms) {
      
      if (!myRoom.roomBetween(room)) {
        
         let success = myRoom.connectRoom(room);
         
         if (success) {
            return true;
         }

      }
      else {
         console.log(`room between ${myRoom} and ${room}`);
      }
   }
   return false;
}
Room.prototype.nearestNeighbor = function() {

   let shortest = null, nearestRoom = null, success = false;

   let rooms = this.findPotentialRooms();

   rooms = rooms.filter(x => !this.roomBetween(x));

   let validRooms = [];

   const distanceTo = (room) => {
      let diffX = this.x - room.x;
      let diffY = this.y - room.y;
      let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
   };
   const compareDist = (room1,room2) => {
      return distanceTo(room1) - distanceTo(room2);
   };

   let sorted = rooms.sort(compareDist);

   for (let room of sorted) {

      success = this.connectRoom(room);

      if (success) { 
         console.log('match found for Room' + this.id);
         break;
       }
   }
   return success;
}
