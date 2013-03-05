//Platforms
//var nrOfPlatforms = 7;
var platforms = [];
var platformWidth = 70;
var platformHeight = 20;
var platformSpeed = 3;

var generatePlatforms = function(nrOfPlatforms, xDistance, yDistance){
    
    var positionX = 0;
    var positionY = 0;
    
    for(var i=0; i<nrOfPlatforms; i++){
        
        
        platforms[i] = new Platform(positionX, positionY, platformWidth, platformHeight, '#EEEE00');//new Platform(Math.random()*(canvasWidth-platformWidth), position, type);
        
        if(positionX < canvasHeight - platformHeight){
            positionX +=  xDistance;
            positionY += yDistance;
            
            platformWidth += xDistance;
        }
    }
}

function AddSimplePlatform(x, y, width){
    platforms.push(new Platform(x, y, width, 25, '#000000'));
}

var Platform = function(x, y, width, height, color){ 
    //function takes position and platform type  

    this.firstColor = color;  
    this.secondColor = '#EEEE00';  

    this.x = x;  
    this.y = y; 
    this.height = height;
    this.width = width;
    
    this.speed = Math.random() * (25 - 5) + 5;
    
    
    
    this.isColliding = function(collider){
        
        if(this.x + this.width < collider.X ||
           this.x > collider.X + collider.width ||
           this.y > collider.Y + collider.height ||
           this.Y + this.height < collider.Y){
                return false;
           }
           
        return true;
    }
    
    this.checkCollision = function(collider){  
        
        var colliding = this.isColliding(collider);
        
        if(collider.isFalling && colliding){
            
            collider.fallStop();
            collider.setPosition(collider.X, this.y - collider.height);
            //collider.score += 5;
            
        }
    } 
    
    this.update = function(){
        /*if(this.x + this.width  < 0){
            
            this.x = canvasWidth + (Math.random() *50);
            this.y = y; 
            this.speed = Math.random() * (25 - 5) + 5
        }*/
        
        //this.x -= this.speed;
        this.x -= platformSpeed;
    }
    
    this.draw = function(ctx){
        ctx.fillStyle = 'rgba(255,255,255,1)';
        
        var gradient = ctx.createRadialGradient(this.x + (this.width/2), this.y + (this.height/2), 5, this.x + (this.width/2), this.y + (this.height/2), 45); 
        
        gradient.addColorStop(0, this.firstColor);
        gradient.addColorStop(1, this.firstColor);
        //gradient.addColorStop(1, this.secondColor);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}