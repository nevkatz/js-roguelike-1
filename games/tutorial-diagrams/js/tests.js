
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

   for (var room of game.rooms) {

      let success = room.findFacingRooms();
   }
}