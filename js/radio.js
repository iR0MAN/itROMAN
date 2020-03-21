
    
   // var songs = [src="http://pldm.ml/radio.php?url=https://www.eskago.pl/radio/eska-warszawa", src="http://pldm.ml/radio.php?url=https://www.eskago.pl/radio/eska-rock",src="http://pldm.ml/radio.php?url=https://www.eskago.pl/radio/eska-goraca-100"];
   var songs = [src="3.mp3", src="2.mp3",src="1.mp3"]; 
   var poster = ["grafika/poster1.jpg","grafika/poster2.jpg","grafika/poster3.jpg"];
    var title = ["JEDEN","DWA","TRZY"];
    
    var songTitle = document.getElementById("songTitle");
    var fillBar = document.getElementById("fill");

    var currentTime = document.getElementById("currentTime");
    
    var volumeslider=document.getElementById("volumeslider");  //music volume

    var song = new Audio();
    var currentSong = 0;    // it point to the current song
    
    window.onload = playSong;   // it will call the function playSong when window is load
     
    volumeslider.addEventListener('mousemove' , setvolume); // music volume mouse bar



    function playSong(){
        
        song.src = songs[currentSong];  //set the source of 0th song 
        
        songTitle.textContent = title[currentSong]; // set the title of song
        
        song.play();    // play the song
    }
    
    function playOrPauseSong(){
        
        if(song.paused){
            song.play();
            $("#play img").attr("src","grafika/Pause.png");
        }
        else{
            song.pause();
            $("#play img").attr("src","grafika/Play.png");
        }
    }
    
    song.addEventListener('timeupdate',function(){ 
        
        var position = song.currentTime / song.duration;
        
        

        convertTime(Math.round(song.currentTime));
    });
    
    function convertTime(seconds){
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;
        currentTime.textContent = min + ":" +sec;

        totalTime(Math.round(song.duration));
    }

    
    function totalTime(seconds){
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;
        currentTime.textContent += "/" + min + ":" +sec;
    }
    

    function next(){
        
        currentSong++;
        if(currentSong > 2){
            currentSong = 0;
        }
        playSong();
        $("#play img").attr("src","grafika/Pause.png");
        $("#image img").attr("src",poster[currentSong]);
        $("#bg img").attr("src",poster[currentSong]);
    }

    function pre(){
        
        currentSong--;
        if(currentSong < 0){
            currentSong = 2;
        }
        playSong();
        $("#play img").attr("src","grafika/Pause.png");
        $("#image img").attr("src",poster[currentSong]);
        $("#bg img").attr("src",poster[currentSong]);
    }



   
    function setvolume() {
        song.volume = volumeslider.value / 100;   // music volume 
    }


