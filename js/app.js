// Enemies our player must avoid
var Enemy = function(x,y,speed) {
  // Variables applied to each of our instances go here,
  // The image/sprite for our enemies, this uses
  this.sprite = 'images/enemy-bug.png';   
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.score;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
 this.x += 100 * this.speed * dt;
 if(Math.abs(this.x)>=505){
      this.x = -100;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//To check for the collision between all enemies and the player and 
//to calculate the score points. Whenever there is a collision between enemy and the player
//the score gets decremented by 100 and the player resets to original position.
Enemy.prototype.checkCollisions = function() {
  if (player.a < this.x + 90 &&
    player.a + 65 > this.x &&
    player.b < this.y + 60 &&
    70 + player.b > this.y) {
      this.score = document.getElementById("score").innerHTML;
      player.reset();
      this.score -= 100;
      document.getElementById("score").innerHTML = this.score;
 }
};

// Instantiated four enemy objects by using Enemy Class.
var enemy1 = new Enemy(-30,18,.9);
var enemy2 = new Enemy(-150,100,1);
var enemy3 = new Enemy(-30,183,2);
var enemy4 = new Enemy(-100,19,.8);

// Placed all enemy objects in an array called allEnemies[].
var allEnemies = [enemy1,enemy2,enemy3,enemy4];
//--------------------------------------------------------------------------------------------------------------------------------

//Created a PickaPlayer class to select the player.
var PickaPlayer = function(spr,x,y) {
  this.sprite = spr;
  this.x=x;
  this.y=y;
}

//Instantiated the objects which will be used in the intial screen by using the PickaPlayer class.
var image1 = new PickaPlayer('images/char-boy.png',50,0);
var image2 = new PickaPlayer('images/char-cat-girl.png',50,85);
var image3 = new PickaPlayer('images/char-pink-girl.png',50,170);
var image4 = new PickaPlayer('images/char-horn-girl.png',50,255);
var image5 = new PickaPlayer('images/char-princess-girl.png',50,345);
var bug1 = new PickaPlayer('images/enemy-bug.png',250,140);
var gem1 = new PickaPlayer('images/Gem Green.png',220,340);
var gem2 = new PickaPlayer('images/Gem Orange.png',300,340);
var gem3 = new PickaPlayer('images/Gem blue.png',380,340);

//placed all gems image in a array called allColorGem[].
var allColorGem = [gem1,gem2,gem3];

//Placed all players image in an array called allPlayers[].
var allPlayers = [image1,image2,image3,image4,image5];

//To draw the images on the intial screen.
PickaPlayer.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//------------------------------------------------------------------------------------------------------------------------------

//created a player Class "Player"
var Player = function(a,b) {
  this.sprite;
  this.a = a;
  this.b = b;
  this.score;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.a, this.b);
};

//This function is to reset the player in the starting position.
Player.prototype.reset = function() {
  this.a=200;
  this.b=360;
}

//Instantiated the player object.
var player = new Player(200,360);
//-------------------------------------------------------------------------------------------------------------
//Gems Constructor Class to build the gems objects.
var Stones = function(spr,x,y,spd) {
  this.sprite = spr;
  this.x = x;
  this.y = y;
  this.score;
  this.speed = spd;
};

//This function is to render the gem objects in the canvas.
Stones.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//This function helps to check whether the player picked the gems. The outer IF statement says whether there is a collision between player and gems
// The rest of the "if" and "Elseif" check whether what color he picked and where to put the gems.
//And it increases the score by 500 for each gem whenever he picks the gems.
Stones.prototype.pickGem = function(gems) {
  if(player.a < this.x + 40 &&
  player.a + 65 > this.x &&
  player.b < this.y + 40 &&
  75 + player.b > this.y) {
    this.score = document.getElementById("score").innerHTML;
    this.score = Number(this.score) + 500;
    document.getElementById("score").innerHTML = this.score;   
      if(gems === gemGreen) {
          this.y = -200;
      }
      else if(gems === gemBlue) {
          this.y = -230;
      }
      else if(gems === gemOrange) {
          this.y = -330;
      }        
  }
};

//Its a reset function for the Gems.
Stones.prototype.reset = function() {
  gemGreen.x = 230;
  gemGreen.y= 70;
  gemBlue.x= 432;
  gemBlue.y = 235;
  gemOrange.x = 28;
  gemOrange.y = 150;  
};

Stones.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
 this.x += 100 * this.speed * dt;
 if(Math.abs(this.x)>=505){
      this.x = -100;
  }
};

// Instantiate the gem objects.
var gemGreen = new Stones('images/Gem Green.png',230,68,.2);
var gemOrange = new Stones('images/Gem Orange.png',28,150,.7);
var gemBlue = new Stones('images/Gem blue.png',432,235,1.5);

//place the gem objects in an Array "allGems".
var allGems = [gemBlue,gemGreen,gemOrange];

//----------------------------------------------------------------------------------------------------------
//This EventListener is to move the player in different direction according to the selected key.
// This listens for key presses and sends the keys to your
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

//This function listens to the key direction and the player moves according to the keypress event.
player.handleInput = function(dir) {
    if(dir === 'left'){
      if(this.a <= 20){
        this.a = 200;
      }
      else 
      {
        this.a -= 100;
      }   
    }

    if(dir === 'up') {
        this.score = document.getElementById("score").innerHTML;
        if(this.b <= 28) {
          this.a = 200;
          this.b = 360;
          this.score = Number(this.score) + 1000;
          document.getElementById("score").innerHTML = this.score; 
        } 
        else 
        {
         this.b -= 83;   
        }
    }

    if(dir === 'right'){
        if(this.a >= 380){
          this.a = 200
        }
        else 
        {
          this.a += 100;
        }
    }

    if(dir === 'down'){
      if(this.b >= 360){
        this.b = 360;
      }
      else
      {
        this.b += 83;  
      }   
    }       
}

//This function is to create a audio element where i can play any background music on browser loading.
function createAudio(src) {
  var audio = document.createElement('audio');
  audio.volume = .3;
  audio.loop   = true;
  audio.src    = src;
  return audio;
}

var song1 = createAudio('audio/Arcade4.mp3');

song1.play();

//calculateTime() is calculated here by using setInterval().In that increment() function is called for every 1000ms 
//where the sec is decremented to 0 from 60s.

 var sec,
    timer;

function myStopFunction() {
  clearInterval(timer);
}   

function calculateTime() {
  sec = document.getElementById('time').innerHTML;
  timer = setInterval("increment()",1000);
}

function increment() {
  if(sec != 0) {
    sec = sec-1;
    document.getElementById('time').innerHTML = sec;
  }
  else if(sec == 0) {
    player.reset();
    myStopFunction();
    }    
}

//---------------------------------------------------------------------------------------------------------------------------------


