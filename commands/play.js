const yts  = require('yt-search')
const ytdl = require('ytdl-core-discord');

module.exports = {
    args: true,
	name: 'play',
	description: 'Plays audio from youtube via search or link',
	async execute(message, args, server) {
        
        /* https://regexr.com/3dj5t */
        let re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        
        var yt_link = ''
        if( re.test(args[0]) ) 
            yt_link = args[0]
		else {
            const r = await yts( args.join(' ')  )
            yt_link = r.videos[0].url
        }

        const playing_message = await server.channel.send(`Playing '${yt_link}' click on reaction to pause`)

        server.dispatcher = server.connection.play(await ytdl(yt_link), {type: 'opus'} );

        console.log(`Message id: ${playing_message.id}`)
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
