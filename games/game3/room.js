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
Room.prototype.findFacingRooms = function() {
   let maxRooms = 1;

   let tolerance = -1;
   let rooms = this.findPotentialRooms();
   let success = false;
   for (var room of rooms) {

      if ((this.overlapsHoriz(room,tolerance) && !this.roomBetween(this,room)) ||
         //let dist = this.vertDist(room);
          (this.overlapsVert(room, tolerance) && !this.roomBetween(this,room))) {


         this.connectRoom(room);
         successs = true;
         //neighbors.horiz.push({room,dist});

      }
      if (this.neighbors.length > maxRooms) {

         break;
      }
   }
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

    }

    return;
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
// we need both a vertical or horizontal overlap.

Room.prototype.overlapsHoriz = function(room, wall=0) {
   return this.overlapsRight(room, wall) || this.overlapsLeft(room, wall);
}
Room.prototype.overlapsVert = function(room, wall=0) {
   return this.overlapsTop(room, wall) || this.overlapsBot(room, wall);
}
/**
 * Used to eliminate rooms.
 * 
 */ 
Room.prototype.overlaps = function(room, wall=0) {
   return this.overlapsHoriz(room, wall) && this.overlapsVert(room, wall);
}


Room.prototype.fillMap = function() {

   for (var y = this.start.y; y <= this.end.y; ++y) {
      for (var x = this.start.x; x <= this.end.x; ++x) {

         game.map[y][x] = FLOOR_CODE;
      }
   }
}


Room.prototype.contains = function(x, prop) {
   return x >= this.start[prop] && x <= this.end[prop];
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

      if (testRoom.betweenVert(this,room) || testRoom.betweenHoriz(this,room)) {
         return true;
      }
   } 
   return false;
}
Room.prototype.connectRoom = function(room) {

   let success = false;
   this.neighbors.push(room);

   room.neighbors.push(this);

   const tolerance = -2;

   if (this.overlapsHoriz(room, tolerance) || this.overlapsVert(room,tolerance)) {

     
      success = this.connectDirect(room, tolerance);
   }
   else {
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

   let horiz = null, vert = null;

      /**
       *  *--- room (onRight)
       *  |
       *  |
       * this
       */
      if (this.onLeft(room)) {
         horiz = {
            // start at corner
            start:corner,
            // and on left of this 
            end:{x:room.start.x,y:room.center.y}
         };
      }
      /**  
       *  room ---*
       *          |
       *         this
       */
      if (this.onRight(room)) {
           horiz = { 
             start:{x:room.end.x, y:room.center.y},
             end:corner,
           };
      }

      /**
       *    this
       *      |    
       *      *---room
       */ 
      if (this.above(room)) {
           vert = {
             // start at corner, go down
             start:{x:this.center.x,y:this.end.y},
             // end at top center of other room
             end:corner
           };
      }
      /**  
       *  room ---*
       *          |
       *         this
       */
      if (this.below(room)) {
          vert = {
            start:corner,
            end:{x:this.center.x, y:this.start.y},
          };
      }

      if (checkAdjacentVert(vert) && checkAdjacentHoriz(horiz)) {
           addPath(vert);
           addPath(horiz);

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

   let horiz = null, vert = null;
   
      /**  
       *  this   ----*
       *             |
       *             |
       *            room
       */
      if (this.onLeft(room)) {
           horiz = { 
             start:{x:this.end.x, y:this.center.y},
             end:corner,
            };
      };
      /**
       *  *--- this (onRight)
       *  |
       *  |
       * room
       */
      if (this.onRight(room)) {
         horiz = {
            // start at corner
            start:corner,
            // and on left of this 
            end:{x:this.start.x,y:this.center.y}
         };
      }
      /**
       *    this---*
       *           |
       *          room
       * 
       */ 
      if (this.above(room)) {
           vert = {
             // start at corner, go down
             start:corner,
             // end at top center of other room
             end:{x:room.center.x, y:room.start.y}
           };
      }
      /*

      room                    room
      |                        |
      |                        |
      *----this        this----*
       */
      if (this.below(room)) {
          vert = {
            start:{x:room.center.x, y:room.end.y},
            end:corner
          };
      }
      if (checkAdjacentVert(vert) && checkAdjacentHoriz(horiz)) {
           addPath(vert);
           addPath(horiz);
      }
      else {
         console.log('[cornerHoriz] there is another path right next to this one for ' + this.id + ' and ' + room.id);
         removeNeighbors(this,room);
          return false;
      }
      return true;
}
Room.prototype.connectDirect = function(room, tolerance) {

 console.log(`${this.id} is using directConnect  with ${room.id}`);
   let found = false;
 let doorLine = {
      start:{
         x:0,
         y:0
      },
      end:{
         x:0,
         y:0
      }
   };

   let path = {
      start:{
         x:0,
         y:0
      },
      end:{
         x:0,
         y:0
      }
   };
   let limit = 1;
   if (this.overlapsHoriz(room, tolerance)) {

        if (Math.abs(this.start.x - room.start.x) < limit ||
            Math.abs(this.end.x - room.end.x) < limit) {
     

           doorLine.start.x = doorLine.end.x = this.center.x;
        }

        else if(this.overlapsLeft(room)) {
          doorLine.start.x = room.start.x;
          doorLine.end.x = this.end.x;
        }
        else if (this.overlapsRight(room)) {
          doorLine.start.x = this.start.x;
          doorLine.end.x = room.end.x;
        }
        else {
         console.log('should have horiz overlap but none for ' + this.id);
        }


        // determine the start and endpoints of a vertical path
        if (this.above(room)) {
         path.start.y = this.end.y;
         path.end.y = room.start.y;
       }
       else if (this.below(room)) {
         path.start.y = room.end.y;
         // our room is below so make this the end point
         path.end.y = this.start.y;
       }
       else {
         console.log('no path available...');
       }

         for (var x = doorLine.start.x; x <= doorLine.end.x; ++x) {
           if (room.contains(x, 'x') && this.contains(x, 'x') && checkAdjacentVert(path,x)) {
            found = true;
            path.start.x = path.end.x = x;
           }
         }

       if (found) {
          addPath(path, this.id);
       }
       else {
          removeNeighbors(this,room);
          return false;
       }
     
   }
   else if (this.overlapsVert(room, tolerance)) {

       if (Math.abs(this.start.y - room.start.y) < limit ||
            Math.abs(this.end.y - room.end.y) < limit) {

           console.log(this.id + ' and ' + room.id + ' are vert aligned');

           doorLine.start.y = doorLine.end.y = this.center.y;
        }

       else if (this.overlapsTop(room)) {
          doorLine.start.y = room.start.y;
          doorLine.end.y = this.end.y;
       }
       else if (this.overlapsBot(room)) {
         doorLine.start.y = this.start.y;
         doorLine.end.y = room.end.y;
       }
       else {
         console.log('should have vert overlap but none for ' + this.id);
       }
       // determine start and end points
       if (this.onLeft(room)) {
         path.start.x = this.end.x;
         path.end.x = room.start.x;
       }
       else {
 
         path.start.x = room.end.x;
         // room is on the right
         path.end.x = this.start.x;
       }

       // get a viable vertical position

       for (var y = doorLine.start.y; y <= doorLine.end.y; ++y) {
         if (room.contains(y, 'y') && this.contains(y, 'y') && checkAdjacentHoriz(path,y)) {
            path.start.y = path.end.y = y;
            found = true;
         }
       }
       if (found) {
         addPath(path, this.id);
       }
       else {
         removeNeighbors(this,room);
         return false;
       }
   }
   else {
      console.log('no overlap for ' + this.id);
      return false;
   }

   
  return true;
}
Room.prototype.findPotentialRooms = function() {
   let rooms = game.rooms.filter(x => x.id != this.id);
   let obj = this;
   
   // eliminate rooms that are already neighbors
   if (this.neighbors.length > 0) {
        rooms = rooms.filter(x => {
          let isNeighbor = obj.neighbors.find(neighbor => neighbor.id == x.id);
          return !isNeighbor;
         });
   }
   else {
      console.log(this.id + ' has no neighbors at this time...');
   }
   return rooms;
}
Room.prototype.findNearest = function(myRoom, rooms) {
   let shortest = null;
   let nearestRoom = null;

   for (var room of rooms) {
      console.log('type of room in findNearest: ' + typeof(room));
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

         console.log('tried to connect Room' + room.id + ' to Room' + myRoom.id + '. Success: ' + success);
         
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
