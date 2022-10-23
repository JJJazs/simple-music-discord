
const fs = require('fs');
const ytdl = require('ytdl-core');
const {createAudioPlayer, createAudioResource, AudioPlayerStatus} = require('@discordjs/voice');

class Player {
    
    mediaQueue = []
    progress = 0;
    currentMedia = null;
    status = "idle";
    error = false;

    constructor(){
    }

    play(){
        console.log("Resume song")
    }
    pause(){
        console.log("Paused Song")
    }
    stop(){
        console.log("Operation Halted")
    }
    queue(){
        console.log("Queue List")
        for(let x = 0; x !== this.mediaQueue.length; x++){
            console.log(this.mediaQueue[x])
        }
    }
    add(url) {
        console.log(`Adding ${url} to the Queue`);
        this.mediaQueue.push(url)
    }
}

let player2 = new Player();
player2.add("asd")
player2.add("chugjug with you")
player2.add("fortnite menu music")
player2.add("Bury the Light")
player2.queue()

console.log(player2.mediaQueue)