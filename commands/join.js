const fs = require('fs')
const stream = require('stream')
const audioStreamHandler = require("../stream_handler.js")

const testing = false

module.exports = {
	name: 'join',
	description: 'Joins senders voice channel',
	async execute(message, args, server) {
		const sender = message.member
        const senderVoiceChannel = sender.voice.channel
        if (!senderVoiceChannel) {
            console.log("Not in a voice channel")
            return
        }
        for (let [snowflake, con] of server.client.voice.connections) {
            if (con.channel == senderVoiceChannel) {
                console.log(`Already in ${senderVoiceChannel}`)
                return
            }
        }
        
        const connection = await senderVoiceChannel.join()
        
        server.connection = connection
        console.log(`Connection to voice channel is made ${connection}`)
        
        const dispatcher = connection.play('/home/valtov/Projects/Discord/UIFinal.mp3')

        dispatcher.on('start',  () => { console.log('joined.mp3 is now playing!'); });
        dispatcher.on('finish', () => { console.log('joined.mp3 has finished playing!'); });
        dispatcher.on('error', console.error);
        server.dispatcher = dispatcher

        connection.on('speaking', (user, speaking) => { 
            if (speaking.toArray() == 'SPEAKING') 
            {
                console.log(`I'm listening to ${user.username}. Speaking object: ${speaking.toArray()}`)
                
                const audioStream = connection.receiver.createStream(user, { mode: 'pcm' });
                var stream1 = audioStream.pipe(new stream.PassThrough())
                if (testing) {
                    var stream2 = audioStream.pipe(new stream.PassThrough())
                    var random = (function genRand() { return Math.floor( 1000000 * Math.random() ) })();
                    console.log(`Random number: ${random}`)
                    stream2.pipe(fs.createWriteStream('../audio_test_files/audioDump' + random + '.raw'));
                    console.log(`Saved ${random}`)
                }
                audioStreamHandler.processStream(stream1, connection, server)
            } 
            else 
                console.log(`I stopped listening to ${user.username}`)
        })
        },
    };
