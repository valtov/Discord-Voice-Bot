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

exports.processSpeech = processSpeech; 