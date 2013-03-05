
/* MEMBERS */
//GLOBALS//

//Input
var pressedKeys = [];

//Canvas
var canvasWidth;  
var canvasHeight;
var c = document.getElementById('c');
var ctx;

//Timing
var fps;

var GAMESTATES = { 
    INTRO:0,
    MENU:1,
    LEVELINTRO:3,
    LEVELPLAY:4,
    LEVELOUTRO:5,
    CHANGELEVEL:6,
    GAMEOVER:7,
    GAMEWON:8,
    INVALID:404
}

//Gameplay
var level = 0;
var gameState;


var gradeCounter = new GradeCounter(10, 10, 100, 50);


//player
var player;

//Background
var howManyCircles = 10;
var circles = [];  
  



//Shitty comments are shitty. Seriously, I'm ashamed of myself.
  
/* END MEMBERS */

/* EVENTS */

document.onkeydown = function(e){
    pressedKeys[e.keyCode] = true;
}

document.onkeyup = function(e){
    pressedKeys[e.keyCode] = false;
}

var loadFinished = false;

function onLoad(){
    loadFinished = true;
}

/* END EVENTS */

/* MAIN GAME LOOP */

var GameLoop = function(){  
    
    if(pressedKeys[80] == true){
        ToggleSound();
        pressedKeys[80] == false;
    }
    
    
    
    switch(gameState){
        case GAMESTATES.INTRO:
            PlayIntro(ctx);
            break;
        case GAMESTATES.MENU:
            DrawMenu(ctx);
            break;
        case GAMESTATES.LEVELINTRO:
            levelIndex[level].intro(ctx);
            break;
        case GAMESTATES.LEVELPLAY:
            levelIndex[level].play(ctx);
            
            //If the l-key is pressed, skip to the next level
            if(pressedKeys[76] == true){
                gameState = GAMESTATES.LEVELOUTRO;
            }
            break;
        case GAMESTATES.LEVELOUTRO:
            levelIndex[level].outro(ctx);
            break;
        case GAMESTATES.CHANGELEVEL:
            loadNextLevel(1);
            break;
        default:
            break;
    }
}
/* MAIN GAME LOOP END*/

/* INITIALIZE */

var Init = function(width, height, framesPerSecond, disableSound, levelIndex){
    
    gameState = GAMESTATES.INVALID;
    
    canvasWidth = width;  
    canvasHeight = height;
    
    
    ctx = c.getContext('2d');
    
    c.width = canvasWidth;  
    c.height = canvasHeight;
    
    for (var i = 0; i < howManyCircles; i++){
        circles.push([Math.random() * canvasWidth, Math.random() * canvasHeight, Math.random() * 100, Math.random() / 2]);  
    }
    
    var speed = 10;
    
    fps = 1000/framesPerSecond;
    
    InitLevels();
    InitIntro();
    
    if(disableSound == true){
        ToggleSound();
    }
    
    if(levelIndex != undefined && levelIndex > 0){
        loadNextLevel(levelIndex);
    }
    
    //This effectively starts the game
    setInterval(GameLoop, fps);
    
}

/* END INITIALIZE */

/* HELPER FUNCTIONS */

var loadNextLevel = function(incrementer){
    
    if(player == undefined){
        player = new Player("Graphics/GameBoyBuggy.png");
        player.setPosition(canvasWidth/4, groundLevel-player.height);  
        player.isFalling = true;
    }
    
    if(level> 0){
        levelIndex[level].unload();
    } else{
        var drawContainer = document.getElementById("container");
        var button = document.getElementById("StartButton");
        
        if(button != null){
            drawContainer.removeChild(button);
        }
        
        
    }
    
    level += incrementer;
    
    if(level in levelIndex){
       
        var nextLevel = levelIndex[level];
        nextLevel.load();
        
        player.setPosition(0-player.width, groundLevel-player.height);
        
        gameState = GAMESTATES.LEVELINTRO;
        
    } else {
        level = 0;
        InitIntro();
        gameState = GAMESTATES.INTRO;
    }
    
    
    
    player.score = 0;
    
    
}

var MoveCircles = function(deltaX){  
  for (var i = 0; i < howManyCircles; i++) {  
    if (circles[i][0] + circles[i][2] < 0) {  
        //the circle vanished on the left  
        //so we change informations about it
        
        //Set new radius
        circles[i][2] = Math.random() * 100;  
        
        //Set new canvasHeight
        circles[i][1] = Math.random() * canvasHeight;
        
        //Set x outside the screen
        circles[i][0] = canvasWidth + circles[i][2];
        
        //Set opacity
        circles[i][3] = Math.random() / 2;  
    } else {  
//move circle deltaX pixels right  
      circles[i][0] -= deltaX;  
    }  
  }  
}

var DrawCircles = function(){  
  for (var i = 0; i < howManyCircles; i++) {  
    ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';  
//white color with transparency in rgba  
    ctx.beginPath();  
    ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);  
//arc(x, y, radius, startAngle, endAngle, anticlockwise)  
//circle has always PI*2 end angle  
    ctx.closePath();  
    ctx.fill();  
  }  
}

var clear = function(){  
    ctx.fillStyle = '#d0e7f9';  
    //set active color to #d0e... (nice blue)  
    //UPDATE - as 'Ped7g' noticed - using clearRect() in here is useless, we cover whole surface of the canvas with blue rectangle two lines below. I just forget to remove that line  
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
    //clear whole surface  
    ctx.beginPath();  
    //start drawing  
    ctx.rect(0, 0, canvasWidth, canvasHeight);  
    
    //draw rectangle from point (0, 0) to  
    //(canvasWidth, canvasHeight) covering whole canvas  
    ctx.closePath();  
    //end drawing  
    ctx.fill();  
    //fill rectangle with active  
    //color selected before  
}


/* END HELPER FUNCTIONS */
