import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { getLocationFromCoords, getWeather, getWindDirection } from '../utils/weather/weather_utils.js';

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
        let lat = interaction.options.getNumber('latitude');
        let long = interaction.options.getNumber('longitude');

        if (!lat || !long) {
            lat = -33.8727;
            long = 151.2057;
        }

        await getWeather(lat, long).then(async weatherData => {
            let locationString = 'Current weather';
            try {
                const loc = await getLocationFromCoords(lat, long);
                locationString += ` in ${loc[0][0].name}`;
            } catch (err) {
                console.error("Error looking up location:", err);
            }

            const weatherString = `Currently **${weatherData.current.temperature_2m} °C**
            Cloud cover at **${weatherData.current.cloud_cover}%** with a **${weatherData.current.rain}%** chance of rain
            Winds at **${weatherData.current.wind_speed_10m} km/h** from the **${getWindDirection(weatherData.current.wind_direction_10m)}** with wind gusts up to **${weatherData.current.wind_gusts_10m} km/h**`;

            const weatherEmbed = new EmbedBuilder()
                .setColor(0x0099FF) // Hex color
                .setTitle(locationString)
                .setURL(`https://www.google.com/maps/@${lat},${long},15z/`)
                // .setDescription('This is the main body text of the embed.')
                .addFields(
                    // { name: 'Regular field title', value: 'Some value here' },
                    { name: '', value: weatherString },
                    // { name: 'Inline field title', value: 'Some value here', inline: true },
                    // { name: 'Another inline title', value: 'Some value here', inline: true },
                )
                .setTimestamp() // current time
                .setFooter({ text: 'Weather data obtained from Open-Meteo.'});

            await interaction.editReply({embeds: [weatherEmbed]});
        });
    },
};