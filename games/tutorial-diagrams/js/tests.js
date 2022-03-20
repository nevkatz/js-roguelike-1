
/**
 * Two rooms stacked
 */ 
function testOne() {
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
function testTwo() {

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
function testThree() {

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
/**
 * Two rooms facing each other
 */ 
function testFive() {
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
function testSix() {
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
   
   //labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

  // drawBox(22,27,3,17,'#03c04a',4);

}
