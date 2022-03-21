class Path {

	constructor(points={}) {

		this.start = points.start || {x:0,y:0};

		this.end = points.end || {x:0,y:0};

		this.allowed = false;

	}
}



Path.prototype.isAdjacentVert = function(testX,type) {

   let score = 0;
   let limit = 5;

   let x = testX || this.start.x;

   for (var y = this.start.y; y <= this.end.y; ++y) {

         if (game.map[y][x-1] == FLOOR_CODE ||
             game.map[y][x+1] == FLOOR_CODE)

         score++;
   }
    console.log('adjacent vert score at '+x+': ' + score + ' type: ' + type);
   return score >= limit;
}

Path.prototype.isAdjacentHoriz = function(testY,type) {
   let score = 0;
   let limit = 5;

   let y = testY || this.start.y;

   for (var x = this.start.x; x <= this.end.x; ++x) {
         if ((game.map[y-1] && game.map[y-1][x] == FLOOR_CODE) ||
             (game.map[y+1] && game.map[y+1][x] == FLOOR_CODE))
         
         score++;
   }
   console.log('adjacent horiz score at '+y+': ' + score + ' type: ' + type + ' start: ' + this.start.x + ' end: ' + this.end.x);
   return score >= limit;
}