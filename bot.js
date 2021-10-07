const fs = require('fs')
const Discord = require("discord.js");
const {prefix, token} = require('./config.json')

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
  const main_channel = message.channel
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

discordClient.login(token);

