
/**
 * Two rooms stacked
 */ 
function toVertAligned() {
   resetMap();

   let r1 = {
      x:20,
      y:20
   };

   let r2 = {
      x:20,
      y:40
   };


   addRoom(r1);
   addRoom(r2);

   drawMap(0, 0, COLS, ROWS);

}
/**
 * Four rooms in plus-sign formation
 */ 
function threeVertAligned() {

   let diff = { 
      x:10,
      y:8
   };

   resetMap();

   let center = {
      x:40,
      y:20
   };
   let above = {
      x:center.x,
      y:center.y - diff.y
   };

   let below = {
      x:center.x,
      y:center.y + diff.y
   };
   let right = {
      x:center.x + diff.x,
      y:center.y
   };

   let left = {
      x:center.x - diff.x,
      y:center.y
   };
   let centers = [center,above,below,left,right];

   for (var c of centers) { addRoom(c); }

   drawMap(0, 0, COLS, ROWS);

   labelRooms();
   

}
/**
 * Four rooms in plus-sign formation
 */ 
function fourFacingRooms() {

   let diff = { 
      x:14,
      y:12
   };

   resetMap();

   let center = {
      x:35,
      y:20
   };
   let above = {
      x:center.x,
      y:center.y - diff.y
   };

   let below = {
      x:center.x,
      y:center.y + diff.y
   };
   let right = {
      x:center.x + diff.x,
      y:center.y
   };

   let left = {
      x:center.x - diff.x,
      y:center.y
   };
   let centers = [center,above,below,left,right];

   for (var c of centers) { addRoom(c); }

   connectBasic(0);

   drawMap(0, 0, COLS, ROWS);

   labelRooms();

}
function connectBasic(tolerance) {
   for (var room of game.rooms) {
      room.findFacingRooms(tolerance);
   }
}

function testOverlapLeft() {
   resetMap();

   let r1 = {
      x:20,
      y:20
   };

   let r2 = {
      x:26,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
   connectBasic(-2);

   drawMap(0, 0, COLS, ROWS);
   
   labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

  // drawBox(22,17,3,27,'#03c04a',6);

}
function testOverlapRight() {
   resetMap();

   let r1 = {
      x:32,
      y:20
   };

   let r2 = {
      x:26,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
   connectBasic(-2);

   drawMap(0, 0, COLS, ROWS);
   
   labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

  // drawBox(22,17,3,27,'#03c04a',6);

}
function testNonOverlap() {
   resetMap();

   let r1 = {
      x:18,
      y:20
   };

   let r2 = {
      x:27,
      y:28
   };


   addRoom(r1);
   addRoom(r2);
   connectBasic(0);

   drawMap(0, 0, COLS, ROWS);
   
   labelRoomsX();

  // drawBox(22,24,3,13,'#03c04a',6);

  // drawBox(22,17,3,27,'#03c04a',6);

}
/**
 * Two rooms facing each other
 */ 
function showVertOverlap() {
   resetMap();

   let r1 = {
      x:20,
      y:30
   };

   let r2 = {
      x:26,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
  // connectBasic(-1);

   drawMap(0, 0, COLS, ROWS);
   
   //labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

   drawBox(22,27,3,17,'#03c04a',4);

}
function vertFacing() {
   resetMap();

   let r1 = {
      x:20,
      y:30
   };

   let r2 = {
      x:23,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
   connectBasic(-1);

   drawMap(0, 0, COLS, ROWS);


}
// possible solve by moving the corners.
function cornerEdgeCase() {

   resetMap();

   let r1 = {
      x:20,
      y:30
   };

   let r2 = {
      x:26,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
   connectBasic(-1);

   drawMap(0, 0, COLS, ROWS);
   


}

function testCornerVert() {
   resetMap();

   let main = {
      x:30,
      y:30
   };

   let topLeft = {
      x:10,
      y:20
   };

     let botLeft = {
      x:10,
      y:40
   };


   let mainRoom = addRoom(main);
   let tlRoom = addRoom(topLeft);
   let blRoom = addRoom(botLeft);

   mainRoom.connectRoom(tlRoom);
   mainRoom.connectRoom(blRoom);

   drawMap(0, 0, COLS, ROWS);

}



function testCornerHoriz() {
   resetMap();

   let main = {
      x:50,
      y:30
   };

   let topRight = {
      x:60,
      y:20
   };

   let botLeft = {
      x:36,
      y:40
   };


   let mainRoom = addRoom(main);
   let trRoom = addRoom(topRight);
   let blRoom = addRoom(botLeft);

   mainRoom.connectRoom(trRoom);
   mainRoom.connectRoom(blRoom);

   drawMap(0, 0, COLS, ROWS);

}


