/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function ShootingEnemy(X, Y){
    this.X = X;
    this.Y = Y;
    
    this.shootY = 5;
    
    this.image = new Image();
    this.image.src = "Graphics/enemy.png";
    
    this.width = this.image.width;
    this.height = this.image.height;
    
    this.projectiles = [];
    
     for(i=0;i<3;i++){
        this.projectiles[i] = new Shot(0, 0, 0, 0);
    }
    
    this.shootTimer = 0;
    
    this.isActive = false;
    
    this.update = function(){
        this.X -= platformSpeed;
        
        if(this.isActive){
            for(var projectile in this.projectiles){
                if(this.projectiles[projectile].isActive){
                    this.projectiles[projectile].update();
                    
                    if(this.projectiles[projectile].collidesWith(runPlayer)){
                        runPlayer.isHit();
                        this.projectiles[projectile].isActive = false;
                    }
                }
            }
            
            this.shoot(runPlayer.X, runPlayer.Y);
            this.shootTimer++;
        }
    }
    
    this.draw = function(ctx){
        if(this.X < canvasWidth){
            this.isActive = true;
            ctx.drawImage(this.image, this.X, this.Y);
            
        }
        
        for(var drawShots in this.projectiles){
            this.projectiles[drawShots].draw(ctx);
        }
    }
    
    this.shoot = function(x, y){
        //Get shooting point
        for(var projectile in this.projectiles){
            
            if(this.projectiles[projectile].isActive == false && this.shootTimer > 5){
                
                var shootingX = this.X;
                var shootingY = this.Y + this.shootY;

                var shootingVectorX = x - shootingX;
                var shootingVectorY = y - shootingY;
                
                this.projectiles[projectile].setActive(shootingVectorX, shootingVectorY, shootingX, shootingY);
                this.shootTimer = 0;
                break;
            }
        }
    }
    
    this.isHit = function(){
        this.X = 0 - this.width;
    }
}
