
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
function overlapHorizLabeled() {
   resetMap();

   let r1 = {
      x:7,
      y:5
   };

   let r2 = {
      x:12,
      y:14
   };

   let room1 = addRoom(r1);
   let room2 = addRoom(r2);



   renderCanvas(20, 20);

   let fontSize = 15;
   let y1 = 3.2, y2 = -1.2;
   let xs = 0.5, xe = 8;
   labelRoomFlex(room1,'start',{x:xs,y:y1}, fontSize);
   labelRoomFlex(room1,'end',{x:xe,y:y1}, fontSize);

   labelRoomFlex(room2,'start',{x:xs,y:y2}, fontSize);
   labelRoomFlex(room2,'end',{x:xe,y:y2}, fontSize);

}

function overlapHorizLabeled2() {
   resetMap();

   let r1 = {
      x:12,
      y:5
   };

   let r2 = {
      x:7,
      y:14
   };

   let room1 = addRoom(r1);
   let room2 = addRoom(r2);



   renderCanvas(20, 20);

   let fontSize = 15;
   let y1 = 3.2, y2 = -1.2;
   let xs = 0.5, xe = 8;
   labelRoomFlex(room1,'start',{x:xs,y:y1}, fontSize);
   labelRoomFlex(room1,'end',{x:xe,y:y1}, fontSize);

   labelRoomFlex(room2,'start',{x:xs,y:y2}, fontSize);
   labelRoomFlex(room2,'end',{x:xe,y:y2}, fontSize);

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
function overlapVertLabeled() {
   resetMap();

   let r1 = {
      x:6,
      y:4
   };

   let r2 = {
      x:18,
      y:8
   };

   let room1 =  addRoom(r1);
   let room2 = addRoom(r2);

   renderCanvas(25, 13);

    
   let fontSize = 15;
   let ye = 3.2, ys = -1.3;
   let xs = 0.5, xe = 7.8;
   // change
   labelRoomFlex(room1,'start',{x:xe-0.3, y:ys}, fontSize);
   labelRoomFlex(room1,'end',{x:xe, y:ye}, fontSize);

   labelRoomFlex(room2,'start',{x:xs, y:ys}, fontSize);

   // change
   labelRoomFlex(room2,'end',{x:xs, y:ye}, fontSize);

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
function inBetweenHoriz() {
   resetMap();

   let horizRooms = inBetweenHorizHelper();

   renderCanvas(37,9);


   
   //labelRoomFlex(horizRooms[1],'test room',{x:2.5,y:1},15);
   labelBetweenRooms(horizRooms);


}
function labelBetweenRooms(rooms) {
   let positions = [3.5,2.5,3.5];
   let labels = ['room2','test room','room1'];

   for (let i = 0; i < rooms.length; ++i) {

      let x = positions[i];
      let label = labels[i];
     

      labelRoomFlex(rooms[i],labels[i],{x,y:1},15);

   }
}
function inBetweenHorizHelper() {
   let w = 12, rooms = []
   let origX = 6, origY = 4;
   for (var i = 0; i < 3; ++i) {
      let r = {
         x:origX+(i*w),
         y:origY
      };
      let room = addRoom(r);
      rooms.push(room);
   }
   return rooms;

}
function inBetweenVert() {
   resetMap();

   let vertRooms = inBetweenVertHelper();

   renderCanvas(13,25);
   

  // labelRoomFlex(vertRooms[1],'test room',{x:2.5,y:1},15);

  labelBetweenRooms(vertRooms);


}
function inBetweenVertHelper() {
   let h = 8, rooms = []
   let origX = 6, origY = 4;
   for (var i = 0; i < 3; ++i) {

      let r = {
         x:origX,
         y:origY+(i*h)
      };
      console.log(`coords: ${r.x},${r.y}`);
      let room = addRoom(r);
      rooms.push(room);
   }
   return rooms;

}
function testNonOverlap() {
   resetMap();

   let origX = 6, origY = 4;
   let r1 = {
      x:origX,
      y:origY
   };

   let r2 = {
      x:origX+10,
      y:origY+8
   };


  let room1 = addRoom(r1);
  let room2 = addRoom(r2);
  let fontSize = 15;
   connectBasic(1);

   renderCanvas(23,17);
   
   //labelRoomsX();


   //labelRoomFlex(room1,'end.x = '+room1.end.x,{x:3.7,y:1}, fontSize);
   //labelRoomFlex(room2,'start.x = '+room2.start.x,{x:0.5,y:1}, fontSize);

  // drawBox(22,24,3,13,'#03c04a',6);

  // drawBox(22,17,3,27,'#03c04a',6);

}
/**
 * Two rooms facing each other
 */ 
function showVertOverlap() {
   resetMap();

   let origX = 6
   let origY = 4;

   let r1 = {
      x:origX,
      y:origY
   };

   let r2 = {
      x:origX + 8,
      y:origY + 9
   };


   let room1 = addRoom(r1);
   let room2 = addRoom(r2);
   //room1.findFacingRooms(3);
  // connectBasic(-1);

   renderCanvas(21,18);
   
   //labelRooms();
   vertAnnotateTiles(origX,origY);
   let fontSize = 15;

   labelRoomFlex(room1,'end.x = 11',{x:3.5,y:1}, fontSize);
   labelRoomFlex(room2,'start.x = 9',{x:0.5,y:1}, fontSize);

}
function vertOverlapCompareStarts() {
   resetMap();

   let origX = 6
   let origY = 4;

   let r1 = {
      x:origX,
      y:origY
   };

   let r2 = {
      x:origX + 8,
      y:origY + 9
   };


   let room1 = addRoom(r1);
   let room2 = addRoom(r2);
   //room1.findFacingRooms(3);
  // connectBasic(-1);

   renderCanvas(21,18);
   
   //labelRooms();

   let fontSize = 15;


   let str1 = `start.y = ${room1.start.y}`;
   let str2 = `start.y = ${room2.start.y}`;
   let y = -1.4

   labelRoomFlex(room1,str1,{x:3.5,y}, fontSize, 'grey');
   labelRoomFlex(room2,str2,{x:0.5,y}, fontSize);
}
function vertOverlapCompareEnds() {
   resetMap();

   let origX = 6
   let origY = 4;

   let r1 = {
      x:origX,
      y:origY
   };

   let r2 = {
      x:origX + 8,
      y:origY + 9
   };


   let room1 = addRoom(r1);
   let room2 = addRoom(r2);
   //room1.findFacingRooms(3);
  // connectBasic(-1);

   renderCanvas(21,18);
   
   //labelRooms();

   let fontSize = 15;
   console.log(`ends: ${room1.end.y},${room2.end.y}`);

   labelRoomFlex(room1,'end.y = 7',{x:3.5,y:3}, fontSize);
   labelRoomFlex(room2,'end.y = 16',{x:0.5,y:3}, fontSize,'grey');
}
function vertAnnotateLabel() {

}
function vertAnnotateBox(origX,origY) {

  // drawBox(22,24,3,13,'#03c04a',6);
   let boxLeft = origX + 3;
   let boxTop = origY - 3;
   drawBox(boxLeft,boxTop,3,16,'#03c04a',2);
}
function vertAnnotateTiles(origX,origY) {

    // drawBox(22,24,3,13,'#03c04a',6);

   let tileTop = origY + 3;

   for (var i = 0; i < 3; ++i) {
      let myX = origX +3 + i;
      labelTile(myX, tileTop,'purple');
      labelTile(myX, tileTop+3,'purple');
   }

}
function showHorizDoorTiles() {
   resetMap();

   let r1 = {
      x:10,
      y:5
   };

   let r2 = {
      x:16,
      y:15
   };


   let room1 = addRoom(r1);
   let room2 = addRoom(r2);

  // connectBasic(-1);

   renderCanvas(27,21);
   
   //labelRooms();

  // drawBox(22,24,3,13,'#03c04a',6);

   //drawBox(22,27,3,17,'#03c04a',2);

  for (var j = 0; j < 3; ++j) {
    for (var i = 0; i < 5; ++i) {

      let color = (i == 0 || i == 4) ? 'red' : 'blue';
      let myX = i+11;
      let myY = j+9;
      labelVertPathTile(myX,myY,color);
    }
  }
  let fontSize = 15;

   labelRoomFlex(room1,'Math.min()',{x:3.5,y:-1}, fontSize);
   labelRoomFlex(room1,'finds the',{x:5,y:1}, fontSize);
   labelRoomFlex(room1,'leftmost end',{x:2.5,y:3},  fontSize)

     let x = 0.5;
   labelRoomFlex(room2,'Math.max()',{x,y:-1}, fontSize);
   labelRoomFlex(room2,'finds the',{x,y:1}, fontSize);
   labelRoomFlex(room2,'rightmost start',{x,y:3},  fontSize);

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

