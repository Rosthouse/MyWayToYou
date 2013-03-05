var projectiles;

/*
 * This stuff hurts our poor player!
 */
function Projectile(image, speed, hittimer, score){
    this.speed = speed;
    this.hitTimer = hittimer;
    
    this.image = image;
    
    this.X = -50;
    this.Y = 0;
    
    this.score = score;
    
    
    this.height = function(){
        return this.image.height;
    }
    
    this.width = function(){
        return this.image.width;
    }
    
    this.isDead = false;
    
    this.collidesWith = function(hand){
        if(this.X + this.width() < hand.X() ||
           this.X > hand.X() + hand.width() ||
           this.Y > hand.Y() + hand.height() ||
           this.Y + this.height() < hand.Y()){
                return false;
           }
           
        return true;
    }
    
    this.update = function(){
        
        
        if(this.X + this.width() + 10 < 0){
            
            this.X = canvasWidth + 10;
            
            this.Y = Math.random()* groundLevel - this.height();
            
            this.speed = Math.random() * (5+this.score);
        }
        
        this.X -= this.speed;
    }
    
    this.draw = function(ctx){
        
        ctx.drawImage(this.image, this.X, this.Y);
        
        
        ctx.fillStyle   = '#00f'; //blue
        ctx.font = 'Italic 30px Sans-Serif';
        ctx.fillText(this.score, this.X + 12, this.Y + 30);
    }
    
    this.getScore = function(){
        switch(this.score){
            case 1:
                return -3;
                break;
            case 2:
                return -2;
                break;
            case 3:
                return -1;
                break;
            case 4:
                return 1;
                break;
            case 5:
                return 2;
                break;
            case 6:
                return 3;
                break;
        }
        
        return 0;
    }
}

function createProjectiles(numProjectiles){
    
    projectiles = new Array();
    
    for(var i=0; i<numProjectiles; i++){
        var imageIndex = 0;
        var randImg = images[imageIndex];
        var speed = Math.random()* 10;
        var hitTimer = 100;
        
        projectiles[i] = new Projectile(randImg, speed, hitTimer, i+1);
        
        
    }
    
}

function Hand(){
    this.vectors = [];
    this.launched = false;
    this.expanding = false;
    this.image = new Image();
    this.image.src = "Graphics/hand.png";
    this.speedMultiplier = 20;
    this.iteration = 0;
    
    this.launch = function(x, y){
        
        if(!this.launched){
            this.vectors["targetX"] = x;
            this.vectors["targetY"] = y;
            this.launched = true;
            this.expanding = true;
        } else {
            this.expanding = false;
        }
    }
    
    this.height = function(){
        return this.image.height;
    }
    
    this.width = function(){
        return this.image.width;
    }
    
    this.X = function(){
        if(this.launched){
            return this.vectors["directionX"];
        }
        
        return -50;
    }
    
    this.Y = function(){
        if(this.launched){
            return this.vectors["directionY"];
        }
        
        return -50;
    }
    
    this.reset = function(){
        this.launched = false;
    }
    
    this.update = function(){
        
        if(this.launched){
            
            var speed = this.speedMultiplier * this.iteration;
            
            this.vectors["playerX"] = player.X;
            this.vectors["playerY"] = player.Y;
            
            //Calculate the directional vector
            var directionX = this.vectors["targetX"] - this.vectors["playerX"];
            var directionY = this.vectors["targetY"] - this.vectors["playerY"];
            
            //calculate the normal of the directional vector
            var normDirectionX = (1/Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2))) * directionX;
            var normDirectionY = (1/Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2))) * directionY;
        
            //calculate the angle for the hand
            this.angle = Math.acos(normDirectionX);
        
            this.vectors["directionX"] = this.vectors["playerX"] + normDirectionX * speed;
            this.vectors["directionY"] = this.vectors["playerY"] + normDirectionY * speed;
            
            
            
            
            if(this.expanding){
                
                this.iteration += 1;

                var isBigger = CompareDistances(normDirectionX*speed, normDirectionY*speed, directionX, directionY);
                
                for(var i in projectiles){
                    if(projectiles[i].collidesWith(this)){
                        //We have a collision, so we handle it
                        player.score += projectiles[i].getScore();
                        projectiles[i].X = 0 - projectiles[i].width();
                        this.expanding = false;
                    }
                }
                
                if(isBigger){
                    this.expanding = false;
                }
                
            } else {
                
                this.iteration -= 1;
                
                if(this.iteration <= 0){
                    this.launched = false;
                }
            }
            
        }
    }
    
    this.draw = function(ctx){
        
        if(this.launched){
            ctx.lineWidth= 4.0;
            ctx.fillStyle   = '#00f'; //blue
            ctx.strokeStyle = '#f00'; // red
            
            ctx.beginPath();  
            
            ctx.moveTo(this.vectors["playerX"], this.vectors["playerY"]);
            ctx.lineTo(this.vectors["directionX"], this.vectors["directionY"]);
            
            ctx.closePath(); 
            
            ctx.fill();
            ctx.stroke();
            //ctx.closePath();
            
            //start rotating the damn thing
            ctx.save();
            
            //ctx.translate(this.vectors["directionX"], this.vectors["directionY"]);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, this.vectors["directionX"], this.vectors["directionY"]);
            //ctx.drawImage(this.image, 0, 0);
            ctx.restore();
            
            
        }
        
    }
}

function Shot(shootingX, shootingY, startPosX, startPosY){

    this.image = new Image();
    this.image.src = "Graphics/megamanshot.png";
    
    this.isActive = false;


    var speed = 8;

    this.X = startPosX - this.image.width/2;
    this.Y = startPosY - this.image.height/2;
    
    this.width = this.image.width;
    this.height = this.image.height;

    this.shootingVector = NormalizeVector(shootingX , shootingY);

    this.update = function(){
        
        if(this.isActive){
            this.X += this.shootingVector.x * speed;
            this.Y += this.shootingVector.y * speed;
            
            if(this.X > canvasWidth || 
               this.X - this.image.width < 0||
               this.Y > canvasHeight ||
               this.Y - this.image.height < 0
                ){
                this.isActive = false;
            }
        }
        
    }

    this.draw = function(ctx){
        if(this.isActive){
            ctx.drawImage(this.image, this.X, this.Y);
        }
    }
    
    this.setActive = function(shootingX, shootingY, startPosX, startPosY){
        this.X = startPosX - this.image.width/2;
        this.Y = startPosY - this.image.height/2;

        this.shootingVector = NormalizeVector(shootingX , shootingY);
        
        this.isActive = true;
    }
    
    this.collidesWith = function(colidee){
        if(this.X + this.width < colidee.X ||
           this.X > colidee.X + colidee.width ||
           this.Y > colidee.Y + colidee.height ||
           this.Y + this.height < colidee.Y){
                return false;
        }
           
        return true;
    }
}

function SceneryObject(image, posX, posY, speedX, speedY){
    
    this.image = new Image();
    this.image.src = image;
    
    this.posX = posX;
    this.posY = posY;
    
    this.speedX = speedX;
    this.speedY = speedY;
    
    this.out = false;
    
    this.update = function(){
        
        this.posX += speedX;
        this.posY += speedY;
        
        this.out = false;
        
        if( this.posX + this.image.width < 0    ||
            this.posY + this.image.height < 0   ||
            this.posX > canvasWidth             ||
            this.posY > canvasHeight){
                    this.out = true;
        }
    }
    
    this.draw = function(ctx){
        ctx.drawImage(this.image, this.posX, this.posY); 
    }
    
}
