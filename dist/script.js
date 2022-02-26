/**
 * Classes 
 */ 
class Player {
  constructor(level, health, weapon, coords, xp) {
    this.level = level;
    this.health = health;
    this.weapon = weapon;
    this.coords = coords;
    this.xp = xp;
  }
}


class Enemy {
  constructor(health, coords, damage) {
    this.health = health;
    this.coords = coords;
    this.damage = damage;
  }
}

/**
 * 
 * Constants
 */ 
const WEAPONS = [{
  name: "Dagger",
  damage: 15 },
{
  name: "Sword",
  damage: 30 },
{
  name: "Hammer",
  damage: 60 },
 {
  name: "Axe",
  damage: 100
 }
];


const FLOOR_IDX = 1;
const PLAYER_IDX = 2;
const ENEMY_IDX = 3;
const POTION_IDX = 4;
const WEAPON_IDX = 5;

const POTIONS = [10, 20, 30, 40, 50];

// possible health that enemies can do
const ENEMIES_HEALTH = [30, 30, 30, 30, 40, 40, 60, 80];

// possible damage that enemies can do
const ENEMIES_DAMAGE = [30, 30, 30, 30, 40, 40, 60, 80];

// the visible area
const VISIBILITY = 3;

// level algorithm
const MAX_ROOM_SIZE = 15;
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_DISTANCE = 4;
const MIN_ROOM_DISTANCE = 2;

// dimensions
const COLS = 80;
const ROWS = 60;

// total enemies
const TOTAL_ENEMIES = 10;

// starting enemies amount
const STARTING_ENEMIES_AMOUNT = 4;
const STARTING_POTIONS_AMOUNT = 4;
const STARTING_WEAPONS_AMOUNT = 3;

// game object

var game = {
  map:[],
  shadow:[],
  isShadowToggled:false,
  defeatedEnemies:0,
  enemies:[],
  canvas:null,
  context:null,
  busyCoordinates:[]
}

/**
 *  DOM Population
 */ 
var Button = React.createClass({ displayName: "Button",
  action: function () {
    toggleShadow();
  },
  render: function () {
    return React.createElement("button", 
      { className: this.props.class, 
        onClick: this.action 
      }, this.props.text);
  } });

var Map = React.createClass({ displayName: "Map",
  render: function () {
    return (
      React.createElement("canvas", { id: "grid", width: "801px", height: "601px" }));

  } });
var Legend = React.createClass({ displayName: "Legend",
  render: function () {
    return (
      React.createElement("div", null, 
      React.createElement("div", null, React.createElement("h2", null, 

      React.createElement("b", null, "XP"), ": ", React.createElement("span", { id: "xp" }, "0"), "- ", 
      React.createElement("b", null, "Level"), ": ", React.createElement("span", { id: "level" }, "0"), "- ", 
      React.createElement("b", null, "Health"), ": ", React.createElement("span", { id: "health" }, "0"), "- ", 
      React.createElement("b", null, "Weapon"), ": ", React.createElement("span", { id: "weapon" }, "0"), "- ", 
      React.createElement("b", null, "Damage"), ": ", React.createElement("span", { id: "damage" }, "0"))), 
      React.createElement("h3", null, "Enemies left: ", React.createElement("span", { id: "enemies" }, "0"))));

  } });


var View = React.createClass({ displayName: "View",
  render: function () {
    return (
      // parent element
      React.createElement("div", null, 
      // child elements - 
      React.createElement(Legend, null), 
      React.createElement(Map, null), 
      React.createElement(Button, { class: "btn btn-success", text: "Toggle Shadow" })
        ) // end parent element
      ); // end return
  } });


React.render( React.createElement(View, null),
document.getElementById('container'));





/**
 *  HTML5 Canvas
 */ 
game.canvas = document.getElementById("grid");
game.context = game.canvas.getContext("2d");



// player and weapon
var player;

// global shadow status



const MAX_ERRORS_COUNT = 1000;
const MINIMUM_TILES_AMOUNT = 1000;


/**
 * Next steps
 * Adjust the constants
 * 
 */ 

/**
 * Start Game
 */ 
startGame();

function startGame() {
  generateMap();
  setTimeout(gameSetUp(), 1000);
  function gameSetUp() {
    generatePlayer();
    generateWeapon(STARTING_WEAPONS_AMOUNT);
    generateEnemies(TOTAL_ENEMIES);
    generatePotions(STARTING_POTIONS_AMOUNT);
    generateShadow();
    drawMap(0, 0, COLS, ROWS);
    updateLegend();
  }
}

/**
 * The generate map function
 * 
 * This algorithmm starts in the center and works its way outward.
 */ 
function generateMap() {
  for (var row = 0; row < ROWS; row++) {
    game.map.push([]);
    for (var col = 0; col < COLS; col++) {
      game.map[row].push(0);
    }
  }
  var tiles = 0;
  var errors = 0;

  // start in the center

  var x = 0, y = 0;

  const returnToCenter = () => {
      x = COLS / 2;
      y = ROWS / 2;
  }
  returnToCenter();

  const limit = 30000;

  const directions = [-1, 0, 1];

  for (var i = 0; i < limit; i++) {

    // choose a random index
    let d_idx = Math.floor(Math.random() * directions.length);

    // use it to get a random direction
    var increment = directions[d_idx];

    let axis = Math.random() < 0.5 ? 'horiz' : 'vert';

    if (axis == 'horiz') {

      x += increment;

      // while on far left or far right
      while (x <= 3 || x >= COLS - 4) {
        let x_idx = Math.floor(Math.random() * directions.length);
        x += directions[x_idx];
        errors++;
        if (errors > MAX_ERRORS_COUNT) {
          if (tiles < MINIMUM_TILES_AMOUNT) {
            // bring coords back to center
            returnToCenter();

          } else {

            return;
          }
        }
      }
    } else {

      y += increment;

      // we only want to stay at the outer boundeary for so long,
      // so every time we add a floor here, we
      // while near the top or the bottom
      while (y <= 3 || y >= ROWS - 4) {
        let y_idx = Math.floor(Math.random() * directions.length);
        y += directions[y_idx];
        errors++;
        if (errors > MAX_ERRORS_COUNT) {
          // if we still have tiles
          if (tiles < MINIMUM_TILES_AMOUNT) {
            // start again at the center
            returnToCenter();

          } else {
            return;
          }
        }
      }
    }
    // if not a floor, make this a floor
    if (game.map[y][x] != FLOOR_IDX) {
      game.map[y][x] = FLOOR_IDX;
      // we use up a tile.
      tiles++;
    }
    errors = 0;
  } // end the large loop
};



function generatePotions(amount) {
  for (var i = 0; i < amount; i++) {
    var coords = generateValidCoords();
    addObjToMap(coords, 4);
    if (!game.isShadowToggled) {
      drawObject(coords.x, coords.y, "green");
    }
  }
}

function generateWeapon(amount) {
  for (var i = 0; i < amount; i++) {
    var coords = generateValidCoords();
    addObjToMap(coords, 5);
    if (!game.isShadowToggled) {
      drawObject(coords.x, coords.y, "orange");
    }
  }
}

/**
 * 
 * @TODO: Update so it's pure javaScript
 * use an array for the first three
 * use standalone functions for the others
 */ 
function updateLegend() {

  let player_props = ['xp','level','health'];

  for (var prop of player_props) {
    let el = document.getElementById(prop);

    el.textContent = player[prop];
  }

  let weapon_props = [
  {
    domId:'weapon',
    key:'name',
  },
  {
    domId:'damage',
    key:'damage'
  }];


  for (var prop of weapon_props) {

    let { domId, key} = prop;

    let el = document.getElementById(domId);

    el.textContent = player.weapon[key];
  }

  document.querySelector("#enemies").textContent = TOTAL_ENEMIES - game.defeatedEnemies;
}


/**
 *
 * @TODO: Make all maps an array; lose the switch case
 * OR make an associative array that maps cololors to RGB's 
 * BUT FOR NOW, use comments
 * 
 */ 
function drawMap(startX, startY, endX, endY) {

  let colors = [
               // wall
               'grey',
                // floor
                'white',
                // player
                'blue',
                // enemy
                'red',
                // health drop
                'green',
                // weapon
                'orange'
                ];

  // loop through all cells of the map
  for (var row = startY; row < endY; row++) {

    for (var col = startX; col < endX; col++) {

      let color = null;

      // if shadow is on and the shadow is down....
      if (game.isShadowToggled && game.shadow[row][col] == 0) {
        // simply draw black.
        color = 'black';
      } 
      else 
      {
        let c_idx = game.map[row][col];

        color = colors[c_idx];
      }
       drawObject(col, row, color);

    } // end loop
  }
}

function areCoordsFree(x, y) {
  if (game.map[y][x] != 1) {
    return false;
  }
  for (var i = 0; i < game.busyCoordinates.length; i++) {
    try {
      if (game.busyCoordinates[i].x == x && game.busyCoordinates[i].y == y) {
        return false;
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }
  return true;
}

// set the given coords as busy + the 8 neighbors
function addBusyCoords(x, y) {
  game.busyCoordinates.push({
    x: x,
    y: y });

}

function generateValidCoords() {
  var x = Math.floor(Math.random() * COLS);
  var y = Math.floor(Math.random() * ROWS);
  while (!areCoordsFree(x, y)) {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  }
  return {
    x: x,
    y: y };

}
/**
 * @param {Number} amount
 * 
 */ 
function generateEnemies(amount) {
  for (var i = 0; i < amount; i++) {
    // generate valid coordinates.
    let coords = generateValidCoords();

    let h_idx = Math.floor(Math.random() * ENEMIES_HEALTH.length);

    let d_idx = Math.floor(Math.random() * ENEMIES_DAMAGE.length);

    let health = ENEMIES_HEALTH[h_idx];

    let damage = ENEMIES_DAMAGE[d_idx];

    game.enemies.push(new Enemy(health, coords, damage));

    addObjToMap(coords, 3);
  }
}

function generatePlayer() {
  var coords = generateValidCoords();
  player = new Player(1, 100, WEAPONS[0], coords, 30);
  addObjToMap(player.coords, 2);
}

// add given coords to map 
// make the coords and neighbors busy
// and draw object with given color
function addObjToMap(coords, identifier) {
  game.map[coords.y][coords.x] = identifier;
  addBusyCoords(coords.x, coords.y);
}

function drawObject(x, y, color) {
  game.context.beginPath();
  game.context.rect(x * 10, y * 10, 10, 10);
  game.context.fillStyle = color;
  game.context.fill();
}

// key down events
/**
 * 
 * @TODO: Lose the jQuery
 * https://stackoverflow.com/questions/26131686/trigger-keyboard-event-in-vanilla-javascript
 */ 
document.addEventListener('keydown', function (e) {
  var x = player.coords.x;
  var y = player.coords.y;
  var oldX = player.coords.x;
  var oldY = player.coords.y;

  switch (e.which) {
    case 37: // left
      x--;
      break;
    case 38: // up
      y--;
      break;
    case 39: // right
      x++;
      break;
    case 40: // down
      y++;
      break;
    default:
      return; // exit this handler for other keys
  }
  // check if next spot is enemy
  if (game.map[y][x] == ENEMY_IDX) {
    fightEnemy(game.enemies.filter(function (item) {
      return item.coords.x == x && item.coords.y == y;
    })[0]);
  } else if (game.map[y][x] != 0) {
    // if next spot is potion
    if (game.map[y][x] == POTION_IDX) {
      player.health += POTIONS[Math.floor(Math.random() * POTIONS.length)];
      removeObjFromMap(x, y);
      generatePotions(1);
    } else if (game.map[y][x] == WEAPON_IDX) {
      player.weapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
      removeObjFromMap(x, y);
      generateWeapon(1);
    }
    // update player position
    updatePlayerPosition(player.coords.x, player.coords.y, x, y);
    updateLegend();
    drawMap(oldX - VISIBILITY - 1, oldY - VISIBILITY - 1, x + VISIBILITY + 2, y + VISIBILITY + 2);
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

function fightEnemy(enemy) {
  if (player.health - enemy.damage <= 0) {
    gameOver();
    return;
  } else if (enemy.health - player.weapon.damage <= 0) {
    enemyDefeated(enemy);
  }
  enemy.health -= player.weapon.damage;
  player.health -= enemy.damage;
  updateLegend();
}

function enemyDefeated(enemy) {
  game.defeatedEnemies++;
  // check to see if player won
  if (game.defeatedEnemies == 10) {
    userWins();
    return;
  }
  // remove enemy from map.
  removeObjFromMap(enemy.coords.x, enemy.coords.y);
  
  drawMap(enemy.coords.x - 1, enemy.coords.y - 1, enemy.coords.x + 1, enemy.coords.y + 1);
  
  // remove enemy from enemies array

  let e_idx = game.enemies.indexOf(enemy);

  game.enemies.slice(e_idx, 1);

  player.xp += 50;

  // level up if needed.
  if (player.xp - 100 * (player.level - 1) >= 100) {

    player.level++;
  }
  updateLegend();
}

function resetGame() {
  game.defeatedEnemies = [];
  enemies = [];
  game.busyCoordinates = [];
  game.shadow = [];
  map = [];
}

function userWins() {
  alert("YOU CONQUERED THE DUNGEON!");
  resetGame();
  startGame();
};

function gameOver() {
  alert("GAME OVER");
  resetGame();
  startGame();
};

function removeObjFromMap(x, y) {
  // make this a floor coordinate
  game.map[y][x] = FLOOR_IDX;
};


/**
 * Generates a shadow based on the player's position.
 */ 
function generateShadow() {
  // generate start coordinates

  // ternary compares player coords with boundary of map.

  let start = {}, end = {};

  start.x = player.coords.x - VISIBILITY < 0 ? 0 : player.coords.x - VISIBILITY;
  start.y = player.coords.y - VISIBILITY < 0 ? 0 : player.coords.y - VISIBILITY;


  end.x = player.coords.x + VISIBILITY >= COLS ? COLS - 1 : player.coords.x + VISIBILITY;
  end.y = player.coords.y + VISIBILITY >= ROWS ? ROWS - 1 : player.coords.y + VISIBILITY;

  // iterate through all squares on the map
  for (var row = 0; row < ROWS; row++) {
    game.shadow.push([]);
    for (var col = 0; col < COLS; col++) {
      // if this falls within visible region, push 1
      if (row >= start.y && row <= end.y && col >= start.x && col <= end.x) {
        game.shadow[row].push(1);
      // else, push 0
      } else {
        game.shadow[row].push(0);
      }
    }
  }
}

/**
 * Removes old player square from map
 * Adds new square
 * resets shadow
 */ 
function updatePlayerPosition(oldX, oldY, newX, newY) {
  removeObjFromMap(oldX, oldY);

  // set this as the player

  game.map[newY][newX] = PLAYER_IDX;

  player.coords = { x: newX, y: newY };

  let start = {}, end = {};


  /**
   * Update the game.shadow 2D array.
   */ 
  start.x = oldX - VISIBILITY < 0 ? 0 : oldX - VISIBILITY;
  start.y= oldY - VISIBILITY < 0 ? 0 : oldY - VISIBILITY;

  // set ending coordinates
  end.x = newX + VISIBILITY >= COLS ? COLS - 1 : newX + VISIBILITY;
  end.y = newY + VISIBILITY >= ROWS ? ROWS - 1 : newY + VISIBILITY;

  if (oldX > newX) {
    start.x = newX - VISIBILITY;
    end.x= oldX + VISIBILITY;
  }
  if (oldY > newY) {
    start.y= newY - VISIBILITY;
    end.y = oldY + VISIBILITY;
  }
  for (var row = start.y; row <= end.y; row++) {
    for (var col = start.x; col <= end.x; col++) {

      if (row >= newY - VISIBILITY && 
          row <= newY + VISIBILITY && 
          col >= newX - VISIBILITY && 
          col <= newX + VISIBILITY) {
        // show shadow
        game.shadow[row][col] = 1;
      } else {
        // no shadow
        game.shadow[row][col] = 0;
      }
    }
  }
}

function toggleShadow() {
  game.isShadowToggled = !game.isShadowToggled;
  drawMap(0, 0, COLS, ROWS);
}