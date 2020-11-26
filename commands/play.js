const yts  = require('yt-search')
//const ytdl = require('ytdl-core')
const ytdl = require('ytdl-core-discord');
const util = require('util')


module.exports = {
    args: true,
	name: 'play',
	description: 'Plays audio from youtube via search or link',
	async execute(message, args, server) {
        var yt_link = ''

        // https://regexr.com/3dj5t
        let re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        if( re.test(args[0]) ) 
            yt_link = args[0]
		else {
            const r = await yts( args.join(' ')  )
            yt_link = r.videos[0].url
        }
        
        //server.dispatcher = server.connection.play(ytdl(yt_link, { quality: 'highestaudio', filter: 'audioonly' }), );
        
        const playing_message = await server.channel.send(`Playing '${yt_link}' click on reaction to pause`)
        server.dispatcher = server.connection.play(await ytdl(yt_link), {type: 'opus'} );

        console.log(`${playing_message.id}`)
        playing_message.react('⏯️')
        
        const filter = (reaction, user) => {
            return reaction.emoji.name === '⏯️' && !user.bot;
        };
        
        const collector = playing_message.createReactionCollector(filter, {dispose: true});
        
        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            server.dispatcher.pause()
        });
        
        collector.on('remove', (reaction, user) => {
            console.log(`Removed ${reaction.emoji.name} by ${user.tag}`);
            server.dispatcher.resume()
        });
        
    },
};
