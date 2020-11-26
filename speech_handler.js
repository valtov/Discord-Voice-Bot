const yts = require( 'yt-search' )
const ytdl = require("ytdl-core")

async function processSpeech(transcript, connection, server) {
  /* 
   * slice(n) removes the first n chars from the string
   * trim removes all white space before and after the string
   * split takes a regex that matches 1 or more [space] 
   *  and places each substring separated by the regex into an array and returns the array
   */
  const args = transcript.trim().split(/ +/);
  // shift returns the first elem of an array and removes it from the array 
  const command = args.shift().toLowerCase();
    
  if ( !server.client.commands.has(command) ) {
    console.log(`Command ${command} doesn't exist`)
    return;
  }

  try {
    server.client.commands.get(command).execute(transcript, args, server)  
  } catch (error) {
    console.error(error);
	  console.log('there was an error trying to execute that command!');
  }
}
/*
    transcript = transcript.toLowerCase()
    var command;
    if (transcript.length == 1)
        command = transcript;
    else
        command = transcript.substr(0, transcript.indexOf(" "));
    
    console.log(`Command processed: ${command}`)
    switch(command) {
        case 'play':
            console.log('Command: play activated')
            const r = await yts( transcript.substr(transcript.indexOf(" ") + 1)  )
            const yt_link = r.videos[0].url
            server.dispatcher = connection.play(ytdl(yt_link, { quality: 'highestaudio', filter: 'audioonly' }));
            break;
        case 'stop':
            console.log('Command: stop activated')
            server.dispatcher.pause()
            break;
        default:
            console.log(`Command: ${command} invalid`)
    }
    */
    /*
    videos.forEach( function ( v ) {
            const views = String( v.views ).padStart( 10, ' ' )
            console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name } | ${v.url}` )
    } )
    */


exports.processSpeech = processSpeech; 