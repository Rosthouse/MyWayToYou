function Player(imagePath){  
    //create new object based on function and assign   
    //what it returns to the 'player' variable  

    //attributes  
    //create new Image and set it's source to the 
    this.image = new Image();  
    //'angel.png' image I upload above  
    this.image.src = imagePath;

    this.width = 206;  
    //width of the single frame  
    this.height = 250;  
    //height of the single frame  

    this.X = 0;  
    this.Y = 0;  
    //X&Y position  
    
    this.frames = 1;
    this.actualFrame = 0;
    this.interval = 0;

    //Physics!
    this.isJumping = false;
    this.isFalling = false;
    
    this.jumpSpeed = 0;
    this.fallSpeed = 0;
    
    //Collision!
    this.isHit = false;
    this.hitTimer = 0;
    this.render = true;
    
    this.hand = new Hand();

    //Score!
    this.score = 0;
    this.hits = 0;
    
    //methods   
    this.setPosition = function(x, y){  
        this.X = x;  
        this.Y = y;  
    }
    
    this.draw = function(ctx){
        
        if(this.render){
            this.hand.draw(ctx);
            ctx.drawImage(this.image, this.width * this.actualFrame, 0 , this.width , this.height, this.X, this.Y, this.width, this.height);
        }
        
        if (this.interval == 10 ) {  
            if (this.actualFrame == this.frames) {  
                this.actualFrame = 0;  
            } else {  
                this.actualFrame++;  
            }  
            this.interval = 0;  
        }
        
        this.interval++;  
    //all that logic above just  
    //switch frames every 4 loops   
    }
    
    this.jump = function(){
        
        if(!this.isJumping && !this.isFalling){
            //object isn't jumping, so we can jump
            this.fallSpeed = 0;
            this.isJumping = true;
            this.jumpSpeed = 17;
            //Make sound
            PlaySong("Jump", "Audio/jump.ogg", false)
        }
    }
    
    this.checkJump = function (){
        
        this.setPosition(this.X, this.Y - this.jumpSpeed);
        
        this.jumpSpeed--;
        
        if(this.jumpSpeed == 0){
            this.isJumping = false;
            this.isFalling = true;
            this.fallSpeed = 1;
        }
    }
    
    this.checkFall = function (){
        
        if(this.Y < canvasHeight - this.height){
            this.setPosition(this.X, this.Y + this.fallSpeed);
            this.fallSpeed++;
        } else{
            this.fallStop();
        }
    }
    
    this.fallStop = function(){
        
        this.isFalling = false;
        this.fallSpeed = 0;
        
        if(this.Y + this.height > canvasHeight){
            this.setPosition(this.X, canvasHeight - this.height);
        }
        //this.jump();
    }
    
    this.updatePlayer = function(){
        
        this.hitHandeling();
        this.hand.update();
        
        //Check horizontal movement
        if(pressedKeys[65] == true){
            this.moveLeft();
        } else if(pressedKeys[68] == true){
            this.moveRight();
        } 
        
        if(pressedKeys[32] == true){
            this.jump();
        }
        
        if(this.isJumping){
            this.checkJump();
        }
        if(this.isFalling){
            this.checkFall();
        }
    }
    
    this.moveLeft = function(){
        
        if(this.X > 0){
            this.setPosition(this.X - 5, this.Y);
        }
    }
    
    this.moveRight = function(){
        
        if(this.X + this.width < canvasWidth){
            this.setPosition(this.X + 5, this.Y);
        }
    }
    
    this.setHitTimer = function(time){
        if(this.hitTimer <= 0){
            this.isHit = true;
            this.hitTimer = time;
        }
    }
    
    this.hitHandeling = function(){
        if(this.isHit){
            if(this.hitTimer %5 == 0){
                this.render = !this.render;
            }
            
            
            this.hitTimer--;
            if(this.hitTimer <= 0){
                this.isHit = false;
            }
        }
    }
    
    this.reset = function(){
        this.hand.reset();
        this.score = 0;
    }
};

function Runner(){

    this.image = new Image();
    this.image.src = "Graphics/MegaMan.png";

    this.X = 120;
    this.Y = groundLevel-this.image.height;

    this.prevY = 0;

    this.width = 50;
    this.height = 39;

    this.verticalSpeed = 5;
    this.maxVerticalSpeed = 5;

    this.isJumping = false;

    this.projectiles = new Array();
    
    for(i=0;i<5;i++){
        this.projectiles[i] = new Shot(0, 0, 0, 0);
    }

    this.shoot = function(x, y){

        //Get shooting point
        for(var projectile in this.projectiles){
            
            if(this.projectiles[projectile].isActive == false){
                
                var shootingX = this.X + this.width;
                var shootingY = this.Y + 18;

                var shootingVectorX = x - shootingX;
                var shootingVectorY = y - shootingY;
                
                this.projectiles[projectile].setActive(shootingVectorX, shootingVectorY, shootingX, shootingY);
                break;
            }
        }
    }
    
    this.setJump = function(){
        if(this.isJumping == false){
            this.verticalSpeed = -12;
            this.isJumping = true;
        }
    }

    this.update = function(){

        if(this.verticalSpeed != this.maxVerticalSpeed){

            this.verticalSpeed += 0.7;

            if(this.verticalSpeed > this.maxVerticalSpeed){
                this.verticalSpeed = this.maxVerticalSpeed;
            }

        }

        if(pressedKeys[32] ){
            this.setJump();
        }

        this.prevY = this.Y;
        this.Y += this.verticalSpeed;

    }

    this.draw = function(ctx){
        ctx.drawImage(this.image, this.X, this.Y);
    }
    
    this.isHit = function(){
        this.Y = 0;
    }
}




