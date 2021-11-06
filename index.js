require('dotenv').config()

const { Client, Intents } = require('discord.js');
const client = new Client({ 
  intents: [ Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, , Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
const fs = require('fs');
const ytdl = require('ytdl-core');
const { StreamType, joinVoiceChannel,getVoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus} = require('@discordjs/voice');
var validUrl = require('valid-url');



console.log(Object.keys(VoiceConnectionStatus))


let player = createAudioPlayer();


let playerState = {
  status: "Stopped",
  channel: "None",
  playing: "None",
  length: "None",
  queue: [],
  listeners: [],
};


player.on(AudioPlayerStatus.Playing, () => {
  playerState.status = "Playing";
  console.log("Player is now playing");
});

player.on(AudioPlayerStatus.Paused, () => {
  playerState.status = "Paused";
  console.log("Player is now paused");
});

player.on(AudioPlayerStatus.Idle, () => {
  console.log("Player is now idle");

  playerState.status = "Idle";
  console.log(playerState.queue);
  if(playerState.queue.length){
    let item = playerState.queue.shift();
    play(item);
    console.log("Playing next queue item")
  }
});


player.on('stateChange', (oldState, newState) => {
	console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
});

player.on('error', error => {
  
});

async function play(url){

    let info = await ytdl.getBasicInfo(url);
    let title = info.videoDetails.title;
    let length = info.videoDetails.lengthSeconds;
    let author = info.videoDetails.author.name;



    playerState.playing = title;
    playerState.length = length;
    playerState.channel = author;

    await sendDashboard();

    let resource = createAudioResource(ytdl(url, { 
      filter:"audioonly",
      quality: 'highestaudio',
      fmt: "mp3",
      highWaterMark: 1<<25
    }), {
      inputType: StreamType.MP3,
    });
    player.play(resource);
}



function addToQueue(request){
    if (validUrl.isUri(request)) {
      try {
        if(playerState.status !== "Playing"){
          console.log("playing request")
          play(request);
          playerState.status = "Playing";
        } else {
          console.log("Adding Item To Queue");
          playerState.queue.push(request);
        }
      } catch(e) {
        console.log("Player Error", e);
        skip();
      }
    }
}

function skip(){
  player.stop();
  console.log("Skipping");
}




let faceTemp = `
Dashboard
Playing: %title%
Channel: %channel%
`;


async function sendDashboard(){
  try {
    let face = faceTemp;
    face = face.replace("%title%", playerState.playing);
    face = face.replace("%channel%", playerState.channel);
    let channel = await client.channels.fetch('906268142278410330');
    let messages = await channel.messages.fetch()
    await channel.bulkDelete(messages);
    let msg = await channel.send(face);
    
    await Promise.all([
      msg.react("◀"),
      msg.react('⏯'),
      msg.react('▶'),
    ]);
  }
  catch(e) {
    console.error(e);
  }
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await sendDashboard();
});

client.on("messageCreate", async message => {


  try {
    let content = message.content;
    console.log(content);
    let channelId = message.channelId;
    
    let channel = await client.channels.fetch(channelId);
    if (channel.name !== "music-bot-test") throw new Error("Channel is not music-bot-test");
    if(!message.content.includes("Dash")) {
      message.delete();
    }


    let connection = joinVoiceChannel({
      guildId: message.guild.id,
      channelId: message.member.voice.channel.id,
      selfDeaf: true,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    addToQueue(content);

    connection.on(VoiceConnectionStatus.Ready, () => {
      connection.subscribe(player);
    });
  } catch (error) {
    console.error(error);
  }
});


// Client Controls
client.on('messageReactionAdd', function(reaction){
  if("◀" === reaction.emoji.name) {
    console.log("back");
  }
  if("⏯" === reaction.emoji.name) {
    playerState.status === "Paused" ? player.unpause() : player.pause();
  }
  if("▶" === reaction.emoji.name) {
    skip();
  }
});
client.on('messageReactionRemove', function(reaction){
  if("◀" === reaction.emoji.name) {
    console.log("back");
  }
  if("⏯" === reaction.emoji.name) {
    playerState.status === "Paused" ? player.unpause() : player.pause();
  }
  if("▶" === reaction.emoji.name) {
    skip();
  }
});

client.login(process.env.TOKEN);