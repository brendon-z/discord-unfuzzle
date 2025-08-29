import { SlashCommandBuilder } from '@discordjs/builders';
import { rateUV } from '../utils/weather/uv_utils.js';

export default {
	data: new SlashCommandBuilder()
		.setName('uv')
		.setDescription('Gets the current UV rating (in Sydney by default)')
        .addNumberOption(option => option
            .setName('latitude')
            .setDescription('Latitude in decimal form')
        )
        .addNumberOption(option => option
            .setName('longitude')
            .setDescription('Longitude in decimal form')
        ),
	async execute(interaction) {
        let lat = interaction.options.getNumber('latitude');
        let long = interaction.options.getNumber('longitude');

        if (!lat || !long) {
            lat = -33.8727;
            long = 151.2057;
        }
        const apiUrl = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${long}`

        await fetch(apiUrl).then(
            async res => {
                if (!res.ok) {
                    await interaction.reply('Unable to fetch url data!')
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return res.json();
            }
        ).then(
            async data => {
                const currUV = data.now.uvi;
                const uvRating = rateUV(currUV);
                await interaction.reply(`The current UV index is ${uvRating.index}, which is ${uvRating.rating}.\n${uvRating.recc}`);
            }
        )
	},
};