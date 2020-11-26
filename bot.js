const fs = require('fs')
const Discord = require("discord.js");
const {prefix, token} = require('./config.json')
const audioStreamHandler = require("./stream_handler.js")
const ytdl = require("ytdl-core")
var stream = require('stream')

const discordClient = new Discord.Client();

discordClient.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discordClient.commands.set(command.name, command);
}

var server = {'dispatcher': null, 'connection' : null, 'client': null, 'channel': null }

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) { 
    console.log(`Message --${message.content}-- ignored`)
    return;
  }
  const main_channel = discordClient.channels.cache.get('669100761359187972')
  server.channel = main_channel
  server.client = discordClient
  
  /* 
   * slice(n) removes the first n chars from the string
   * trim removes all white space before and after the string
   * split takes a regex that matches 1 or more [space] 
   *  and places each substring separated by the regex into an array and returns the array
   */
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // shift returns the first elem of an array and removes it from the array 
  const commandName = args.shift().toLowerCase();
    
  if ( !discordClient.commands.has(commandName) ) {
    console.log(`Command ${commandName} doesn't exist`)
    return;
  }
  
  const command = discordClient.commands.get(commandName);

  if (command.args && !args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }

  try {
    command.execute(message, args, server)  
  } catch (error) {
    console.error(error);
	  message.reply('there was an error trying to execute that command!');
  }
})
/*
discordClient.on('messageReactionAdd', (reaction, user) => {
  if (server.message == null) return
  if(server.message.id == reaction.message.id){

  }
});

*/
/*
  if (message.content == "/join") {
    const sender = message.member
    const senderVoiceChannel = sender.voice.channel
    if (!senderVoiceChannel) {
      console.log("Not in a voice channel")
      return
    }
    for (let [snowflake, con] of discordClient.voice.connections) {
      if (con.channel == senderVoiceChannel) {
        console.log(`Already in ${senderVoiceChannel}`)
	      return
      }
    }
	
    const connection = await senderVoiceChannel.join()
    console.log(`Connection to voice channel is made ${connection}`)
    const dispatcher = connection.play('./joined.mp3') //ytdl('https://www.youtube.com/watch?v=zSAJ0l4OBHM'))
     
    dispatcher.on('start', () => {
      console.log('joined.mp3 is now playing!');
    });

    dispatcher.on('finish', () => {
      console.log('joined.mp3 has finished playing!');
    });

    // Always remember to handle errors appropriately!
    dispatcher.on('error', console.error);
    
    server.dispatcher = dispatcher

    connection.on('speaking', (user, speaking) => { 
      if (speaking.toArray() == 'SPEAKING') 
      {
        console.log(`I'm listening to ${user.username}. Speaking object: ${speaking.toArray()}`)
	      
        //const audioStream = receiver.createStream(user, { mode: 'pcm' })
        const audioStream = connection.receiver.createStream(user, { mode: 'pcm' });
        var stream1 = audioStream.pipe(new stream.PassThrough())
        var stream2 = audioStream.pipe(new stream.PassThrough())
        var random = (function genRand() {return Math.floor(1000000*Math.random())})();
        console.log(`Random number: ${random}`)
        stream1.pipe(fs.createWriteStream('./audio_test_files/audioDump' + random + '.raw'));
        
        //let idk = audioStream.pipe(Converter).pipe(fs.createWriteStream('TEST_AUDIO' + numConnections))
        //console.log(`Wrote audio to TEST_AUDIO ${idk}`)
        audioStreamHandler.processStream(stream2, connection, server)
      } 
      else 
      {
        console.log(`I stopped listening to ${user.username}`)
      }
    }) // end connection
  }
  */
  //else if (message.content == "/kick") 
  //{
    //for(let [snowflake, con] of discordClient.voice.connections) 
    //{
     // con.disconnect()
    //}
  	
  //}
 // end message block

	/*
client.on('ready', () => {
  voiceChannel = client.channels.get('SOME_CHANNEL_ID');
  voiceChannel.join()
    .then(conn => {
      console.log('Connected')

      const receiver = conn.createReceiver();

      conn.on('speaking', (user, speaking) => {
        if (speaking) {
          const audioStream = receiver.createPCMStream(user);

          ffmpeg(stream)
              .inputFormat('s32le')
              .audioFrequency(16000)
              .audioChannels(1)
              .audioCodec('pcm_s16le')
              .format('s16le')
              .pipe(someVirtualMic);          
        }
      });
    })
    .catch(console.log);
  }); 
*/
discordClient.login(token);

