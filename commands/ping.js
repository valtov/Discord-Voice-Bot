module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, server) {
		message.channel.send('Pong.');
	},
};