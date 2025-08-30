import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { getWeather, getWindDirection } from '../utils/weather/weather_utils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Gets the current weather forecast (in Sydney by default)')
        .addNumberOption(option => option
            .setName('latitude')
            .setDescription('Latitude in decimal form')
        )
        .addNumberOption(option => option
            .setName('longitude')
            .setDescription('Longitude in decimal form')
        ),
    async execute(interaction) {
        await interaction.deferReply();
        let lat = interaction.options.getNumber('latitude') ?? undefined;
        let long = interaction.options.getNumber('longitude') ?? undefined;

        await getWeather(lat, long).then(async weatherData => {
            const weatherString = `Currently **${weatherData.current.temperature_2m} °C**\n` +
            `Cloud cover at **${weatherData.current.cloud_cover}%** with a **${weatherData.current.rain}%** chance of rain\n` +
            `Winds at **${weatherData.current.wind_speed_10m} km/h** from the **${getWindDirection(weatherData.current.wind_direction_10m)}** with wind gusts up to **${weatherData.current.wind_gusts_10m} km/h**`;

            const weatherEmbed = new EmbedBuilder()
                .setColor(0x0099FF) // Hex color
                .setTitle(weatherData.locationString)
                .setURL(`https://www.google.com/maps/@${lat},${long},15z/`)
                .setDescription(weatherString)
                .setTimestamp() // current time
                .setFooter({ text: 'Weather data obtained from Open-Meteo.'});

            await interaction.editReply({embeds: [weatherEmbed]});
        });
    },
};