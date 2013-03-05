/* 
 * This file holds all the menues
 */

var StartGameButton;
var OptionsButton;
var CreditsButton;

var StartMenuSong;

function InitMenu(){
    
    StartMenu();
    gameState = GAMESTATES.MENU;
}

function StartMenu(){
    AddButton("HelloButton");
}

function AddButton(Text){
    var position = getAbsolutePosition("c");
    StartGameButton = createButton("StartButton", "Start Life", position);
    
    StartGameButton.addEventListener('click', function(){
        
        StartGameButton.style.visibility = "hidden";
        StopSong("IntroSong");
        
        gameState = GAMESTATES.CHANGELEVEL;
        
    }, false);
}

function getAbsolutePosition( oElement ){
    var canvas = document.getElementById(oElement);
    
    var positionOfElement = [];
    positionOfElement["x"] = canvas.offsetLeft;
    positionOfElement["y"] = canvas.offsetTop;
    
    
    return positionOfElement;
}

function DrawMenu(ctx){
    clear();
    
    ctx.drawImage(calanda, 0, (canvasHeight - calandaHeight), canvasWidth, calandaHeight);
    
    MoveCircles(1);
    DrawCircles();
        
    ctx.drawImage(titleImage, 0, 0 , titleImage.width, titleImage.height, titleX, titleStop-titleHeight, titleWidth, titleHeight);
      
    
}

function createButton(name, text, position) {
 
    //Create an input type dynamically.
    var element = document.createElement("input");
 
    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("class", "HoverButton");
    element.setAttribute("value", text);
    element.setAttribute("id", name);
    
    
    
    element.style.left = (position["x"] + canvasWidth/2 - element.style.width/2) + "px";
    element.style.top = (position["y"] + canvasWidth/2 - element.style.height/2) + "px";
 
    var MenuLayer = document.getElementById("container");
 
    //Append the element in page (in span).
    MenuLayer.appendChild(element);
    
    return element;
 
}