/* 
 * This file holds the intro
 */

var titleImage;
var calanda;

var titleWidth;
var titleHeight;

var titleX;
var titleY;

var ratio;

var titleStop;

var calandaHeight;

function InitIntro(){
    titleImage = new Image();
    titleImage.src = "Graphics/Menus/Title2.png";
    
    //This solves the loading bug, where it would fail to calculat the ratio because the image was not yet loaded.
    titleImage.onload = (function(){
        var ratio = titleImage.width/titleImage.height;
    
        titleWidth = canvasWidth/1.5;
        titleHeight = titleWidth/ratio;
    
        titleX = canvasWidth/2 - titleWidth/2;
        
        gameState = GAMESTATES.INTRO;
    });
    
    
    
    
    titleY = 0 - 600;
    
    titleStop = (canvasHeight/5)*2;
    
    calanda = new Image();
    calanda.src = "Graphics/Menus/calanda.png";
    
    PlaySong("IntroSong", "Audio/Soundtrack/TitleSong.ogg", true);
}

function PlayIntro(ctx){
    
    clear();
    
    ctx.drawImage(titleImage, 0, 0 , titleImage.width, titleImage.height, titleX, titleY, titleWidth, titleHeight);
    //ctx.drawImage(calanda, 0, canvasHeight-calanda.height);
    calandaHeight = calanda.height * (canvasWidth/calanda.width);
    
    ctx.drawImage(calanda, 0, (canvasHeight - calandaHeight), canvasWidth, calandaHeight);
    MoveCircles(1);
    DrawCircles();
       
    
    if(titleY + titleHeight < titleStop){
        titleY += 1;
    } else{
        InitMenu();
    }
    
    if(pressedKeys[32] == true){
        clear();
        
        ctx.drawImage(titleImage, 0, 0 , titleImage.width, titleImage.height, titleX, titleStop-titleHeight, titleWidth, titleHeight);
        
        ctx.drawImage(calanda, 0, (canvasHeight - calandaHeight), canvasWidth, calandaHeight);
        
        InitMenu();
    }
}