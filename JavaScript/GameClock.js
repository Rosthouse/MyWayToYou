function GameClock(){
    
    this.delta = 0;
    this.previousTime = new Date();
    
    this.Update = function(){
        var currentTime = new Date();
        
        this.delta = currentTime.getMilliseconds() - this.previousTime.getMilliseconds();
        this.previousTime = currentTime;
    }
}