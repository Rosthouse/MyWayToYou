/* 
 * This file holds functions that defines each level by putting projectiles and infos into the main game
 */
var images;

var currentLevel;

var levelSong;
var levelIndex;

var groundLevel;
//var groundPlatform;

var obstacle;



function InitLevels(){
    groundLevel = canvasHeight - canvasHeight/5;
    
    levelIndex = new Array();
    
    AddSong("Level1Song", "Audio/Soundtrack/99705__knarmahfox__overworld-full.ogg", true);
    AddSong("Level2Song", "Audio/Soundtrack/51239__rutgermuller__8-bit-electrohouse.ogg", true);
    
    //groundPlatform = new Platform(0, groundLevel, canvasWidth, canvasHeight, '#CC8D30');
    obstacle = new Platform(canvasWidth, groundLevel - 50, 50, 50, '#2340FF');
    
    //We start loading levels at 1, so we need an empty level at the start
    levelIndex.push(null);
   
    
    //Inserting all levels here
    
    levelIndex.push(new BossLevel3());
    
    //Sandkasten
    var images = ["Graphics/sand1.png", "Graphics/sand2.png", "Graphics/sand3.png"];
    levelIndex.push(new Level("Level1Song", "Graphics/sandkasten.png", images, '#FFE680'));
    
    //Push gym level
    levelIndex.push(new BossLevel1());
    
    //MaturaPrüfung
    levelIndex.push(new BossLevel2());
    
    //School
    //levelIndex.push(new Level("Level2Song"));
    //levelIndex.push(new BossLevel2());
    levelIndex.push(new RunnerLevel());
    
}

function Level(levelSong, backgroundImagePath, clutterArray, groundColor){
    
    this.backgroundImage = new Image();
    this.backgroundImage.src = backgroundImagePath;
    
    this.clutterArray = clutterArray;
    this.clutterImages = [];
    
    
    this.groundPlatform = groundColor;
    
    this.canvasClicked = function(event){
        if(gameState == GAMESTATES.LEVELPLAY){


            var x = event.clientX;
            var y = event.clientY;


            x -= c.offsetLeft;
            y -= c.offsetTop;

            player.hand.launch(x, y);
        }
    }
    
    this.levelSong = levelSong;
    
    this.load = function(){
        
        c.onclick = this.canvasClicked;
        
        images = new Array();
    
        images[0] = new Image();
        images[0].src = "Graphics/grade.png";
        
        this.clutterImages = [];
        
        var startSpeed = RandomMinMax(-7, -5);
        
        for(imagePath in this.clutterArray){
           
            var clutterObject = new SceneryObject(  this.clutterArray[imagePath], 
                                                    canvasWidth + RandomMinMax(0, 20), 
                                                    groundLevel - 50 + RandomMinMax(-5, 5), 
                                                    startSpeed, 0);
                                                    
            startSpeed += RandomMinMax(-1, -3);
            
            this.clutterImages.push(clutterObject);
        }
        
        var groundColor = this.groundPlatform;
        this.groundPlatform = new Platform(0, groundLevel, canvasWidth, canvasHeight, groundColor);
    
        createProjectiles(6);
        
        StartSong(this.levelSong);
        
    }
    
    this.intro = function(ctx){
        clear();

        if(player.X >= canvasWidth/4){
            AddSong("ReadyGo", "Audio/Effects/readygo.ogg", false);
            AddEventListenerToSong("ReadyGo", 'ended', function(){
                gameState = GAMESTATES.LEVELPLAY;
            });

            StartSong("ReadyGo");
        } else{
            player.setPosition(player.X + 5, player.Y);
        }

        this.groundPlatform.draw(ctx);
        player.draw(ctx);

    }
    
    this.play = function(ctx){
        clear();  

        // UPDATING \\
        player.updatePlayer();


        if(obstacle.isColliding(player)){
            player.setHitTimer(100);
        }

        playerOnPlatform = this.groundPlatform.checkCollision(player);

        for (var i in projectiles){
            projectiles[i].update();
        }
        
        for (var clutter in this.clutterImages){
            this.clutterImages[clutter].update();
            
            if(this.clutterImages[clutter].out && this.clutterImages[clutter].posX < 0){
                //reset to a better position
                this.clutterImages[clutter].posX = canvasWidth + RandomMinMax(5, 15);
                this.clutterImages[clutter].reset = true;
            }
        }

        if(player.score > 100){
            player.reset();
            gameState = GAMESTATES.CHANGELEVEL;
        }

        // DRAWING \\
        DrawCircles();

        this.groundPlatform.draw(ctx);
        player.draw(ctx);
        obstacle.draw(ctx);
        

        for(var k in projectiles){
            projectiles[k].draw(ctx);
        }
        
        for(var cl in this.clutterImages){
            this.clutterImages[cl].draw(ctx);
        }

        gradeCounter.draw(ctx);
    }
    
    this.outro = function(ctx){
        gameState = GAMESTATES.CHANGELEVEL;
    }
    
    this.unload = function(){
        StopSong("Level1Song");
        c.onclick = null;
        
        this.clutterImages = null;
        this.backgroundImage = null;
    }
    
}

var runPlayer;

function RunnerLevel(){
    
    this.background = new Image();
    this.background.src = "Graphics/contralvl1.png";
    
    this.backgroundPosition = 0;
    
    this.enemies = []
    
    //Canvas touched
    this.canvasTouched = function(event){
        
        if(gameState == GAMESTATES.LEVELPLAY){
            
            
            var touches = event.touches;
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                
                var x = touch.pageX;
                var y = touch.pageY;


                x -= c.offsetLeft;
                y -= c.offsetTop;

            
                //Check if the player only clicked on the right side (simulates the right side on a smartphone
                if(x >= canvasWidth/2){
                    runPlayer.shoot(x, y);
                }
            }
        }
    }
    
    //We shoot
    this.canvasClicked = function(event){
        if(gameState == GAMESTATES.LEVELPLAY){

            var x = event.clientX;
            var y = event.clientY;


            x -= c.offsetLeft;
            y -= c.offsetTop;

            
            //Check if the player only clicked on the right side (simulates the right side on a smartphone
            if(x >= canvasWidth/2){
                runPlayer.shoot(x, y);
            } else {
                runPlayer.setJump();
            }
            
        }
    }
    
    this.levelSong = levelSong;
    
    this.load = function(){
        runPlayer = new Runner();
        gameState = GAMESTATES.LEVELINTRO;
        
        c.onclick = this.canvasClicked;
        c.touchstart = this.canvasTouched;
        
        AddSimplePlatform(70, 235, 1531);
        AddSimplePlatform(343, 305, 208);
        AddSimplePlatform(550, 374, 71);
        AddSimplePlatform(622, 441, 135);
        AddSimplePlatform(755, 372, 71);
        AddSimplePlatform(893, 303, 138);
        AddSimplePlatform(1238, 443, 137);
        AddSimplePlatform(1309, 336, 204);
        AddSimplePlatform(1581, 235, 277);
        AddSimplePlatform(1858, 235, 342);
        AddSimplePlatform(2200, 235, 274);
        AddSimplePlatform(2474, 235, 549);
        AddSimplePlatform(2887, 171, 1096);
        AddSimplePlatform(2954, 444, 205);
        AddSimplePlatform(3159, 341, 136);
        AddSimplePlatform(3364, 305, 481);
        AddSimplePlatform(3639, 444, 412);
        AddSimplePlatform(3911, 236, 484);
        AddSimplePlatform(4048, 375, 140);
        AddSimplePlatform(4255, 375, 138);
        AddSimplePlatform(4326, 164, 339);
        AddSimplePlatform(4460, 337, 69);
        AddSimplePlatform(4597, 304, 211);
        AddSimplePlatform(4734, 234, 139);
        AddSimplePlatform(4938, 303, 140);
        AddSimplePlatform(4938, 442, 72);
        AddSimplePlatform(5009, 373, 203);
        AddSimplePlatform(5214, 235, 138);
        AddSimplePlatform(5281, 168, 139);
        AddSimplePlatform(5281, 440, 71);
        AddSimplePlatform(5351, 340, 70);
        AddSimplePlatform(5486, 236, 140);
        AddSimplePlatform(5557, 305, 343);
        AddSimplePlatform(5763, 442, 205);
        AddSimplePlatform(6040, 373, 134);
        AddSimplePlatform(6240, 306, 138);
        AddSimplePlatform(6380, 233, 340);
        AddSimplePlatform(6380, 442, 753);
        AddSimplePlatform(6448, 338, 271);
        AddSimplePlatform(6718, 304, 72);
        AddSimplePlatform(6787, 373, 68);
        
        //Add Ground Platform
        AddSimplePlatform(0, 480, 7131);
        
        //Add Enemies
        this.AddEnemy(1344, 303);
        this.AddEnemy(1946, 203);
        this.AddEnemy(3259, 309);
        this.AddEnemy(3322, 139);
        this.AddEnemy(4013, 203);
        this.AddEnemy(4087, 343);
        this.AddEnemy(4483, 304);
        this.AddEnemy(4632, 131);
    }
    
    this.intro = function(ctx){
        gameState = GAMESTATES.LEVELPLAY;

    }
    
    this.play = function(ctx){
        clear();  
        
        this.backgroundPosition -= platformSpeed;
        ctx.drawImage(this.background, this.backgroundPosition, 0);
        
        
        for(var platform in platforms){
            platforms[platform].update();
            //platforms[platform].draw(ctx);
        }
        
        runPlayer.update();
        
        for(var enemy in this.enemies){
            this.enemies[enemy].update();
            
        }
        
        for(var shot in runPlayer.projectiles){
            runPlayer.projectiles[shot].update();
            runPlayer.projectiles[shot].draw(ctx);
            
            for(var enemy1 in this.enemies){
                if(this.enemies[enemy1].isActive){
                    if(runPlayer.projectiles[shot].collidesWith(this.enemies[enemy1])){
                        this.enemies[enemy1].isHit();
                    }
                }
            }
        }
        
        
        
        this.PlayerPhysics();
        
        //DRAWING
        
        //groundPlatform.draw(ctx);
        
        
        for(var drawEnemy in this.enemies){
            this.enemies[drawEnemy].draw(ctx);
        }
        runPlayer.draw(ctx);
    }
    
    this.outro = function(ctx){
        gameState = GAMESTATES.CHANGELEVEL;
    }
    
    this.unload = function(){
        StopSong("Level1Song");
        c.onclick = null;
    }
    
    this.AddEnemy = function(X, Y){
        var newEnemy = new ShootingEnemy(X, Y);
        this.enemies.push(newEnemy);
    }
    
    this.PlayerPhysics = function(){
        //Player is going downwards, collision can occure
        if(runPlayer.verticalSpeed > 0){
            
            for(var platform in platforms){
                //check if we are colliding in the x direction
                if(runPlayer.X + runPlayer.width >= platforms[platform].x && 
                   runPlayer.X  <= platforms[platform].x + platforms[platform].width){
                    //See if our feet are on/in the platform
                    if(runPlayer.Y + runPlayer.height >= platforms[platform].y){
                        //let's check if they were before
                        if(runPlayer.prevY + runPlayer.height <= platforms[platform].y){
                            runPlayer.Y = platforms[platform].y - runPlayer.height;
                            runPlayer.isJumping = false;
                        }
                    }
                }
            }
        }
    }
}

/**
 * Rope climbing level
 */
function BossLevel1(){
    
    this.playerImage = new Image();
    this.playerImage.src = "Graphics/head_pissedoff.png";
    
    this.background = new Image();
    this.background.src = "Graphics/gym.png";
    
    this.playerY = groundLevel;
    this.winHeight = 20;
    
    this.frameTime = 1000/fps;
    
    this.playerX = canvasWidth/5 * 4;
    
    this.frequency = 0;
    this.threshold = 0.0015;
    
    this.lastButtonPress = new Date();
    this.buttonIsPressed = false;
    
    this.load = function(){
    }
    
    this.intro = function(ctx){
        gameState = GAMESTATES.LEVELPLAY;
        var date = new Date()
        this.lastButtonPress = date.getMilliseconds();
    }
    
    this.play = function(ctx){
       
       // UPDATE \\
       if(pressedKeys[32] && !this.buttonIsPressed){
           // We only allow this code if the button was previously up
           this.buttonIsPressed = true;
           var currentTime = new Date();
           
           var deltaT = this.frameTime * this.lastButtonPress;
           
           this.frequency = RoundToDigits(1/deltaT, 4);
           this.lastButtonPress = 0;
           
           
           
       } else {
           
           if(pressedKeys[32] == false){
               //if we want to ever determine the frequency, we need to allow ourselves to press the button
               this.buttonIsPressed = false;
               
           }
           
           this.frequency = 0;
           this.lastButtonPress += 1;
       }
       
       if(this.frequency > this.threshold){
           this.playerY -= (this.frequency * Math.pow(10, 4) )/ 2;
           
           if(this.playerY < this.winHeight){
               // We just won the level!
               gameState = GAMESTATES.LEVELOUTRO;
           }
       } else{
           this.playerY += this.threshold * Math.pow(10, 3);
           if(this.playerY > groundLevel){
               this.playerY -= this.threshold * Math.pow(10, 3);
           }
       }
       
       // DRAWING \\
       clear();
       
       ctx.drawImage(this.background, 0, 0);
       
       ctx.drawImage(this.playerImage, this.playerX, this.playerY);
       
       ctx.fillStyle   = '#00f'; //blue
       ctx.font = 'Italic 30px Sans-Serif';
       ctx.fillText(this.frequency, 12, 30);
       
    }
   
    this.outro = function(ctx){
        gameState = GAMESTATES.CHANGELEVEL;
    }
    
    this.unload = function(){
        
    }
}

/**
 * Maturaprüfung
 */
function BossLevel2(){
    
    Directions = {
        NONE:0,
        LEFT:1,
        RIGHT:2,
        UP:3,
        DOWN:4
    }
    
    function Distraction(direction, position, speed )
    {
        this.direction = direction;
        this.position = position;
        this.speed = speed;
    }
    
    this.baseX = -10;
    this.baseY = 150;
    
    this.playerImage = new Image();
    this.playerImage.src = "Graphics/head_pissedoff.png";
    
    this.background = new Image();
    this.background.src = "Graphics/AttentionBack.png";
    
    this.chair = null;
    
    this.desk = null;
    
    this.score = 0;
    
    // DISTRACTIONS \\
    this.distraction = new Array();
    
    // ATTENTION \\
    // Rule: range from -5 to 5
    // -5: left border
    // 5:  right border
    this.attention = 0;
    
    // CONTROLS \\
    this.pressedDirection = 0;
   
   
    this.startTime = 0;
    
    
    
    this.load = function(){
        this.distraction[Directions.LEFT] = new Distraction(Directions.UP, 11, 1);
        this.distraction[Directions.RIGHT] = new Distraction(Directions.UP, -11, 1);
        
        this.pressedDirection = Directions.NONE;
    }
    
    this.intro = function(ctx){
        gameState = GAMESTATES.LEVELPLAY;
    }
    
    this.play = function(ctx){
        
        //Get currently pressed direction
        var proposedDirection = Directions.NONE;

        if(pressedKeys[65]){
            proposedDirection = Directions.LEFT;
            this.attention -= 0.5;
        } 

        if(pressedKeys[68]){
            if(proposedDirection == Directions.LEFT){
                proposedDirection = Directions.NONE;
            } else{
                proposedDirection = Directions.RIGHT;
                this.attention += 0.5;
            }
        }

        this.pressedDirection = proposedDirection;

        //Update the distractions
        this.updateDistraction(Directions.LEFT);
        this.updateDistraction(Directions.RIGHT);

        //Calculate the moving directions
        /*
        *          *               *
        *          #*              *
        *          #  *            *
        *          y    *          *
        *          #      *        *
        *          #---x---P---x---#
        *          *         *     #
        *          *            *  y
        *          *              *#
        *          *               *
        *          *               *
        */


        var leftDistance = this.calculateDistance(Directions.LEFT) * -1;

        var rightDistance = this.calculateDistance(Directions.RIGHT) ;

        var average = (leftDistance + rightDistance) / 2;

        if(average != 0){
            average = (average > 0) ? 1 : -1;
        }

        //See if we hold against it
        this.attention += average/10;



        if(this.attention > 5){
            this.attention = 5;
        }else if(this.attention <-5){
            this.attention = -5;
        }
        
        
        if(this.attention < 1 && this.attention > -1){
            this.score += 0.05;
        } else if(this.attention < 2.5 && this.attention > -2.5){
            this.score += 0.02;
        } else if(this.attention < 4 && this.attention > -4){
            this.score += -0.03;
        } else {
            this.score += -0.06;
        }
        
        if(this.score < 0){
            this.score = 0;
        }
        
        if(this.score >= 20){
            gameState = GAMESTATES.LEVELOUTRO;
        }
        
        // DRAWING \\
        clear();

        ctx.drawImage(this.background, 0, 0);

        var leftX = canvasWidth/4;
        var rightX = (canvasWidth/4) *3;


        var minY = canvasHeight/10*2;
        var maxY = canvasHeight/10*8;

        var leftY = ((maxY-minY)/10) * this.distraction[Directions.LEFT].position + minY;

        var rightY = ((maxY-minY)/10) * this.distraction[Directions.RIGHT].position + minY;

        var attentionY = (canvasHeight/5) *2
        var attentionX = (canvasWidth/2) + this.attention * 10;


        ctx.drawImage(this.playerImage, leftX + this.baseX, leftY + this.baseY);
        ctx.drawImage(this.playerImage, rightX + this.baseX, rightY + this.baseY);
        ctx.drawImage(this.playerImage, attentionX + this.baseX, attentionY + this.baseY);

        ctx.fillStyle   = '#00f'; //blue
        ctx.font = 'Italic 30px Sans-Serif';
        ctx.fillText(Math.round(this.score), 12, 30);
        ctx.fillText(this.attention, 12, 60);


    }
    
    this.updateDistraction = function(dist){
        
        var currentDirection = this.distraction[dist].direction;
        
        
        //Update the distraction a certain amount
        if(currentDirection == Directions.UP){
            this.distraction[dist].position += this.distraction[dist].speed;
            
            //We went overboard
            if(this.distraction[dist].position >= 10){
                //this.direction[dist] = Directions.NONE;
                this.distraction[dist].direction = Directions.NONE;
            }
        } else {
            this.distraction[dist].position -= this.distraction[dist].speed;
            
            if(this.distraction[dist].position <= 0){
                this.distraction[dist].direction = Directions.NONE;
                //this.direction[dist] = Directions.NONE;
            }
        }
        
        //We went overboard, so we need to reset the distraction
        if(this.distraction[dist].direction == Directions.NONE){
           this.resetDistraction(dist);
        }
        
        
        //Alright, finnished updating the distractions, we can go back now! It's way more fun above there anyway ;)
    }
    
    this.resetDistraction = function(dist){
        var randomNumber = Math.round(Math.random());
           
           if(randomNumber == 1){
               //The distraction will walk UP now
               
               //this.direction[dist] = Directions.UP;
               this.distraction[dist].direction = Directions.UP;
               this.distraction[dist].position = 0 - RandomMinMax(0, 30);
               
           } else {
               //The distraction has to walk DOWN now. Bad luck
               
               //this.direction[dist] = Directions.DOWN;
               this.distraction[dist].direction = Directions.DOWN;
               this.distraction[dist].position = 10 + RandomMinMax(0, 30);
           }
           
               
           this.distraction[dist].speed = RandomMinMax(0.01, 0.1);
    }
    
    this.calculateDistance = function(dist){
        
        if(this.distraction[dist].position > 10 || this.distraction[dist].position < 0){
            return 0;
        }
        var yDifferenc = this.distraction[dist].position - 5;
        
        var distance = Math.sqrt(Math.pow(yDifferenc, 2) + 25);
        
        return distance;
    }
    
    this.outro = function(ctx){
        gameState = GAMESTATES.CHANGELEVEL;
    }
    
    this.unload = function(){
        
    }
}

function BossLevel3(){
    
    //Tetris-Theater
    //Simple tetris clone, the target is to fill as many places as possible -> Rows do not destroy themselves
    
    
    
    /*
     * 
     * Blocks:
     * ##
     *  ##
     *  
     *   ##
     *  ##
     *  
     *  ####
     *  
     *  #
     *  ###
     *  
     *    #
     *  ###   
     * 
     *   #
     *  ###
     * 
     */
    
    this.Block = new function(orX, orY){
        this.Orientation = new Object()
        this.Orientation.x  = orX;
        this.Orientation.y = orY;
        
        
    }
    
    
    
    this.testImage = new Image();
    this.testImage.src = "Graphics/head_pissedoff.png";
    
    this.places = [];
    for(i=0; i<10;i++){
        this.places[i] = [];
        
        for(j=0;j<22;j++){
            this.places[i][j] = false;
        }
    }
    
    
    this.load = function(){
        var i = 1;
    }
    
    this.intro = function(ctx){
        gameState = GAMESTATES.LEVELPLAY;
    }
    
    this.play = function(ctx){
        var x = 0;
        var y = 0;
        
        clear();
        
        for(i in this.places){
            for(j in this.places[i]){
                ctx.drawImage(this.testImage, x, y);
                y += 45;
            }
            
            y = 0;
            x += 45;
        }
    }
    
    this.outro = function(ctx){
        
    }
    
    this.unload = function(ctx){
        
    }
    
}