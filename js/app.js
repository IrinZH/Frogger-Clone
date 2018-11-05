const canvasWidth = 606;
const xLeftLimit = -50;
const xRightLimit = canvasWidth - 100;
const xMove = 100;
const yBottomLimit = 390;
const yTopLimit = -50;
const yMove = 80;
const spriteWidth = 80;
const enemyLocationsY = [70, 150, 230];

const yWIN = -10;

const livesDiv = document.querySelector('.lives');
const winsDiv = document.querySelector('.wins');
const modal = document.querySelector('.win-modal');
const modalHeader = document.querySelector('.modal-header');
const modalContinue = document.querySelector('.modal-continue');

const spriteChooser = document.querySelector('.sprites');
const currentSpriteElement = document.querySelector('.current-sprite');
let currentSpriteSrc = 'images/char-cat-girl.png';

spriteChooser.addEventListener('click', function(event){
  //src property gives absolute path so use attribute src for relative path
  currentSpriteSrc = event.target.getAttribute('src');
  currentSpriteElement.setAttribute('src', currentSpriteSrc);
  player.updateSprite();
});

// Enemies our player must avoid
class Enemy {
  constructor(number) {
    this.sprite = 'images/enemy-bug.png';
    this.number = number;
    this.reset();
  }

  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //check for enemy-player collision
    if (this.y === player.y) {
      if (
        (this.x + spriteWidth >= player.x && this.x <= player.x) ||
        (player.x + spriteWidth >= this.x &&
          this.x + spriteWidth > player.x + spriteWidth)
      ) {
        // console.log(`collision bug--x: ${this.x} y: ${this.y}`);
        player.canMove && (player.handleCollision());
      }
    }
    //check if enemy left screen/canvas then reset enemy
    (this.x > canvasWidth) && (this.reset());
  }

  // Draw the enemy on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //reset enemy properties
  reset() {
    this.speed = Math.floor(Math.random() * (200 - 90)) + 90;
    let tempY = Math.floor(Math.random() * 3);
    this.x = -150 * (this.number);
    this.y = enemyLocationsY[tempY];
  }
}

// Player class
class Player {
  constructor() {
    this.sprite = currentSpriteSrc;
    this.x = 200;
    this.y = yBottomLimit;
    this.wins = 0;
    this.lives = 3;
    this.canMove = true;
  }

  updateSprite(){
    this.sprite = currentSpriteSrc;
  }
  //draw the player on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //handle movement by putting checks for game canvas limits
  handleInput(key) {
    if (this.canMove) {
      switch (key) {
        case 'left':
          (this.x - xMove > xLeftLimit) && (this.x -= xMove);
          break;
        case 'right':
          (this.x + xMove < xRightLimit) && (this.x += xMove);
          break;
        case 'up':
          if (this.y - yMove > yTopLimit) {
            this.y -= yMove;
            (this.checkWin()) && (this.gameWon());
          }
          break;
        case 'down':
          (this.y + yMove <= yBottomLimit) && (this.y += yMove);
          break;
      }
    }
  }

  checkWin() {
    return (this.y === yWIN);
  }

  updateLives(init = false) {
    if (init) {
      //new game
      this.lives = 3;
      livesDiv.textContent = this.lives;
      this.canMove = true;
    }
    else {
      this.lives--;
      livesDiv.textContent = this.lives;
      //check if game lost
      (this.lives === 0) && (this.gameLost());
    }
  }

  //reset player position
  reset() {
    this.x = 200;
    this.y = yBottomLimit;
  }

  //handle collison, reset player position with slight delay
  //so that collision is noticeable
  handleCollision() {
    this.canMove = false;
    this.updateLives();
    let timerId = setTimeout(() => {
      this.reset();
      if (this.lives > 0) {
        this.canMove = true;
      }
    }, 40);
  }

  //lives = 0, display modal
  gameLost() {
    this.canMove = false;
    modalHeader.firstElementChild.textContent = 'Game Over';
    modal.classList.add('show');
  }

  //goal achieved, display modal
  gameWon() {
    this.wins++;
    winsDiv.textContent = this.wins;
    this.canMove = false;
    modalHeader.firstElementChild.textContent = 'Congratulations!!';
    modal.classList.add('show');
  }
}

//create player and enemies
const player = new Player();
const allEnemies = [];
for (let i = 1; i < 7; i++) {
  allEnemies.push(new Enemy(i));
}

// listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//modal Continue button, reset the game
modalContinue.onclick = function() {
  player.reset();
  player.updateLives(true);
  player.canMove = true;
  modal.classList.remove('show');
};
