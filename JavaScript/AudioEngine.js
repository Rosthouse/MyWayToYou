/* 
 * This script keeps track of all played songs and effects and provides an api to play and stop them
 */

var audioList = new Array();
var currentVolume = 1.0;
var audioDisabled = false;

function ChangeVolume(volume){
    if( volume != 0){
        currentVolume = volume;
    }
    
    for(var i in audioList){
        if(audioList[i] != undefined){
            audioList[i].volume = volume;
        }
    }
    
}

function AddEventListenerToSong(name, type, listener){
    audioList[name].addEventListener(type, listener, false);
}

function ToggleSound(){
    if(audioDisabled == false){
        ChangeVolume(0);
        audioDisabled = true;
    } else {
        ChangeVolume(currentVolume)
        audioDisabled = false;
    }
    
}


function PlaySong(name, path, loop){
    
    if(loop){
		AddSong(name, path, loop);
    	StartSong(name); 
    } else {
        if(audioDisabled){
            var song = new Audio();
            song.src = path;
            song.volume = currentVolume;

            song.play();
        }
    }
    
}
    

function AddSong(name, path, loop){
    
    if(!(name in audioList)){
        audioList[name] = new Audio();
    
        audioList[name].src = path;
        if(audioDisabled == true){
            audioList[name].volume = 0;
        } else{
            audioList[name].volume = currentVolume; 
        }
    }
    
    if(loop == true){
        audioList[name].addEventListener('ended', function(){
            this.currentTime = 0;
            this.play();
        }, false);
    }
}

function StartSong(name){
    if(audioList[name] != undefined){
        audioList[name].play();
    }
}

function PlayChachedSong(name){
    audioList[name].currentTime = 0;
    StartSong(name);
}

function PauseSong(name){
    if(audioList[name] != undefined){
        audioList[name].pause();
    }
}

function StopSong(name){
    PauseSong(name);
    audioList[name].currentTime = 0;
}
    

