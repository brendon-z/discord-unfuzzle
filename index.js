import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js';
import { token } from './config.json';
import cron from 'cron';
import { constructEmbed } from './src/utils/calendars/calendar';
import dotenv from 'dotenv';

const guildId = process.env.GUILDID;
const channelId = process.env.CHANNELID;
dotenv.config();

// Create new discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

module.exports = {
  client
};

// Command handler set up
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('/command', { type: ActivityType.Playing });
  let scheduledMessage = new cron.CronJob('00 00 9 * * *', async () => {
	const guild = client.guilds.cache.get(guildId);
	const channel = guild.channels.cache.get(channelId);
	let onCampusEmbed = await constructEmbed(client);
	channel.send({ embeds : [onCampusEmbed] });
  })
  scheduledMessage.start();
});


// Dynamically retrieves and executes commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login bot using token
client.login(token);
