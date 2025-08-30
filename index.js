import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js';
import cron from 'cron';
import 'dotenv/config';
import { constructEmbed } from './src/utils/calendars/calendar.js';
import { maxUV, rateUV } from './src/utils/weather/uv_utils.js';

// Create new discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

// Command handler set up
client.commands = new Collection();
const commandsPath = path.join(process.cwd(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = (await import(filePath)).default;
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('/command', { type: ActivityType.Playing });
	let scheduledMessage = new cron.CronJob('0 0 9 * * *', async () => {
		const guild = client.guilds.cache.get(process.env.GUILD_ID);
		const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
		let onCampusEmbed = await constructEmbed(client);

		const maxUvForecast = (await maxUV())[0];
		const uvRating = rateUV(maxUvForecast);
		const content = `Today's maximum UV index is forecast to be ${uvRating.index}, which is ${uvRating.rating}.\n${uvRating.recc}\n`;

		channel.send({ content: content, embeds : [onCampusEmbed] });
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
client.login(process.env.TOKEN);

export default client;