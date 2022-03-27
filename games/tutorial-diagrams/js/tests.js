
/**
 * Two rooms stacked
 */ 
function twoVertAligned() {
   resetMap();

   let r1 = {
      x:10,
      y:10
   };

   let r2 = {
      x:10,
      y:30
   };

   addRoom(r1);
   addRoom(r2);

   drawMap(0, 0, COLS, ROWS);

}
function twoHorizOverlap() {
   resetMap();

   let r1 = {
      x:8,
      y:7
   };

   let r2 = {
      x:10,
      y:16
   };

   addRoom(r1);
   addRoom(r2);

   renderCanvas(20, 24);

}
function twoVertOverlap() {
   resetMap();

   let r1 = {
      x:8,
      y:7
   };

   let r2 = {
      x:22,
      y:9
   };

   addRoom(r1);
   addRoom(r2);

   renderCanvas(32, 18);

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
      x:21,
      y:17
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

   renderCanvas(43,35);

   //labelRooms();

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
      x:19,
      y:30
   };

   let r2 = {
      x:27,
      y:40
   };


   addRoom(r1);
   addRoom(r2);
  // connectBasic(-1);

   drawMap(0, 0, COLS, ROWS);
   
   //labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

   drawBox(22,27,3,17,'#03c04a',2);

   for (var i = 0; i < 3; ++i) {
      let myX = 22 + i;
      labelTile(myX,37,'purple');
      labelTile(myX,33,'purple');
   }

}
function showHorizdoorTiles() {
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

   drawBox(22,27,3,17,'#03c04a',2);

   let colors = ['purple','blue','red'];
   for (var i = 0; i < 3; ++i) {
      let myX = 22 + i;
      labelTile(myX,37,colors[i]);
   }


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

function directConnectCorner() {

   resetMap();

   let r1 = {
      x:7,
      y:5
   };

   let r2 = {
      x:17,
      y:14
   };


   let room1 = addRoom(r1);
   let room2 = addRoom(r2);

   room1.findFacingRooms(0);

   renderCanvas(26,20);
   


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

function testCornerStairs() {
   resetMap();

   let homeY = 5;
   let main = {
      x:18,
      y:homeY + 9
   };

   let topLeft = {
      x:8,
      y:homeY
   };

     let botRight = {
      x:31,
      y:homeY + 18
   };

   let mainRoom = addRoom(main);
   let tlRoom = addRoom(topLeft);
   let blRoom = addRoom(botRight);

   mainRoom.connectRoom(tlRoom);
   mainRoom.connectRoom(blRoom);

   renderCanvas(40,30);

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
function betweenHoriz() {

   resetMap();

   let y = 7;
   let main = {
      x:24,
      y
   };

   let right = {
      x:39,
      y
   };

   let left = {
      x:9,
      y
   };

   let mainRoom = addRoom(main);
   let rightRoom = addRoom(right);
   let leftRoom = addRoom(left);

   let c = document.querySelector('canvas');

   const w = 49, h = 16;

   c.width = w*TILE_DIM;
   c.height = h*TILE_DIM;

   drawMap(0,0,w,h);


   labelRoom(leftRoom,'room1',2);
   labelRoom(mainRoom,'test room',0.5);
   labelRoom(rightRoom,'room2',2);
}
function betweenVert() {

   resetMap();

   let x = 9;
   let main = {
      x,
      y:17
   };

   let top = {
      x,
      y:8
   };

   let bot = {
      x,
      y:26
   };

   let mainRoom = addRoom(main);
   let botRoom = addRoom(bot);
   let topRoom = addRoom(top);


   renderCanvas(19,38);

   labelRoom(mainRoom,'test room',0.5);
   labelRoom(botRoom,'room2',2);
   labelRoom(topRoom,'room1',2);

}
function betweenVertBlank() {

   resetMap();

   let x = 9;
   let homeY = 6;
   let main = {
      x,
      y:homeY + 9
   };

   let top = {
      x,
      y:homeY
   };

   let bot = {
      x,
      y:homeY + 18
   };

   let mainRoom = addRoom(main);
   let botRoom = addRoom(bot);
   let topRoom = addRoom(top);

   renderCanvas(19,33);

   labelRoom(botRoom,'room2',2);
   labelRoom(topRoom,'room1',2);

}

function renderCanvas(w,h) {

   let c = document.querySelector('canvas');
   
   c.width = w*TILE_DIM;
   c.height = h*TILE_DIM;

   drawMap(0,0,w,h);


}

