import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js';
import cron from 'cron';
import 'dotenv/config';
import { EmbedBuilder } from '@discordjs/builders';
import { constructEmbed } from './src/utils/calendars/calendar.js';
import { maxUV, rateUV } from './src/utils/weather/uv_utils.js';
import { getWeatherForecast, getWindDirection } from './src/utils/weather/weather_utils.js';

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
	let scheduledMessage = new cron.CronJob('00 00 9 * * *', async () => {
		const lat = -33.8727;
		const long = 151.2057;

		const guild = client.guilds.cache.get(process.env.GUILD_ID);
		const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
		let onCampusEmbed = await constructEmbed(client);

		const weatherData = await getWeatherForecast();
		const maxUvForecast = (await maxUV())[0];
		const uvRating = rateUV(maxUvForecast);

		const weatherString = `Today's max temperature will be **${weatherData.daily.temperature_2m_max} °C** with a low of **${weatherData.daily.temperature_2m_min} °C**\n` +
		`**${weatherData.daily.wind_speed_10m_max} km/h** winds from the **${getWindDirection(weatherData.daily.wind_direction_10m_dominant)}** with wind gusts up to **${weatherData.daily.wind_gusts_10m_max} km/h**\n\n` +
		`Today's maximum UV index is forecast to be **${uvRating.index}**, which is **${uvRating.rating}**.\n${uvRating.recc}\n`;

		const weatherEmbed = new EmbedBuilder()
			.setColor(0x0099FF) // Hex color
			.setTitle(weatherData.locationString)
			.setURL(`https://www.google.com/maps/@${lat},${long},15z/`)
			.setDescription(weatherString)
			.setFooter({ text: 'Weather data obtained from Open-Meteo.'});

		channel.send({ embeds : [weatherEmbed, onCampusEmbed] });
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