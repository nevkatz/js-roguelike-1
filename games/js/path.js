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

         if (game.map[y][x-1] != WALL_CODE ||
             game.map[y][x+1] != WALL_CODE) {

            score++;
            
            if (score == limit) {
               return true;
            }

         }
         else {
            score = 0;
         }


       
   }
    console.log('adjacent vert score at '+x+': ' + score + ' type: ' + type);
   return false;
}

Path.prototype.isAdjacentHoriz = function(testY,type) {
   let score = 0;
   let limit = 5;

   let y = testY || this.start.y;

   for (var x = this.start.x; x <= this.end.x; ++x) {
         if ((game.map[y-1] && game.map[y-1][x] != WALL_CODE) ||
             (game.map[y+1] && game.map[y+1][x] != WALL_CODE)) {
                
                score++;

                if (score == limit) { return true; }
         }
         else {
            score = 0;
         }
   }
   console.log('adjacent horiz score at '+y+': ' + score + ' type: ' + type + ' start: ' + this.start.x + ' end: ' + this.end.x);
   return false;
}