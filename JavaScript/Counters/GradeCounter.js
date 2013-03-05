/* 
 * This script keeps track of all positive values the player catches
 */
function GradeCounter(X, Y, width, height){
    this.X = X;
    this.Y = Y;
    this.width = width;
    this.height = height;
    
    
    
    this.draw = function(ctx){
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        
        var color = '#000000';
        
        var fillColor = '#FF2419';
        
        ctx.fillStyle = color;
        ctx.fillRect(this.X, this.Y, this.width, this.height);
        
        var relWidth = (this.width-6) * (player.score/100);
        
        ctx.fillStyle = fillColor;
        
        ctx.fillRect(this.X + 3, this.Y + 3, relWidth, this.height - 6);
        
        
        
        
    }
}

