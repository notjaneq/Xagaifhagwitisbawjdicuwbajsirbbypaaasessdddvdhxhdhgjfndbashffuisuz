// Dependencies
const Discord = require('discord.js'); 
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');
const express = require('express');
const app = express();
const keep_alive = require('./keep_alive.js')



// Functions
const client = new Discord.Client();
const log = new CatLoggr();

// New discord collections
client.commands = new Discord.Collection();

// Logging
if (config.debug === true) client.on('debug', stream => log.debug(stream)); // if debug is enabled in config
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));

// Load commands from folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Command directory
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); // Load the command
    log.init(`Loaded command ${file.split('.')[0] === command.name ? file.split('.')[0] : `${file.split('.')[0]} as ${command.name}`}`); // Logging to console
	client.commands.set(command.name, command); // Set command by name to the discord "commands" collection
};

client.login(process.env.token); 
const activities_list = 
  [ { type: 'PLAYING',  message: 'Made by Janeq'},
   { type: 'PLAYING', message: '.help' },
   { type: 'LISTENING', message: 'Janeq'},
   { type: 'COMPETING', message: 'Generating...' },
   { type: 'WATCHING', message: 'your commands'},
   { type: 'LISTENING', message: 'port 3000'}
];
client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);

        client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });
    }, 5000);
    log.info(`I am logged in as ${client.user.tag} to Discord!`);

});

// Discord message event and command handling
client.on('message', (message) => {
	if (!message.content.startsWith(config.prefix)) return; // If the message does not start with the prefix 
	if (message.author.bot) return; // If a command executed by a bot
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
    // Split message content to arguments
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    // If the command does not exists
	if (config.command.notfound_message === true && !client.commands.has(command)) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Unknown command :(')
            .setDescription(`Sorry, but I cannot find the \`${command}\` command!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
    };

    // Executing the command
	try {
		client.commands.get(command).execute(message, args); // Execute
	} catch (error) {
		log.error(error); // Logging if error

        // Send error messsage if the "error_message" field is "true" in the configuration
		if (config.command.error_message === true) {
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error occurred!')
                .setDescription(`An error occurred while executing the \`${command}\` command!`)
                .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	};
});
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
