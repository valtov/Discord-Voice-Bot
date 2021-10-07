module.exports = {
	name: 'kick',
	description: 'Kicks the bot from the connection',
	execute(message, args, server) {
		server.connection.disconnect()
    },
};


