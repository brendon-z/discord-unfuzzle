import { SlashCommandBuilder } from '@discordjs/builders';
import { parseCalendar, getCalendar, checkClasses, constructEmbed } from '../utils/calendars/calendar.js';

export default {
	data: new SlashCommandBuilder()
		.setName('campus')
		.setDescription('Check who is on campus')
        .addStringOption(option => option.setName('date').setDescription('Add a date (DD-MM-YYYY)')),
	async execute(interaction) {
		let date = interaction.options.getString('date');

        if (!date) {
            date = "today";
        } else {
			try {
				date = date.split("-").reverse().join("-");
			} catch (error) {
				console.log(date + ' ' + error);
			}
		}

        await interaction.deferReply();
        let onCampusEmbed = await constructEmbed(interaction.client, 'everyone', date);
		await interaction.editReply({ embeds: [onCampusEmbed] });
	},
};