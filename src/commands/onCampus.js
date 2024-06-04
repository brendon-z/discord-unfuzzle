import { SlashCommandBuilder } from '@discordjs/builders';
import { constructEmbed, getDateFromString } from '../utils/calendars/calendar.js';

export default {
	data: new SlashCommandBuilder()
		.setName('campus')
		.setDescription('Check who is on campus')
		.addStringOption(option => option
			.setName('day')
			.setDescription('Get their timetable on a particular day')
			.addChoices(
				{name: 'Monday', value: 'monday'},
				{name: 'Tuesday', value: 'tuesday'},
				{name: 'Wednesday', value: 'wednesday'},
				{name: 'Thursday', value: 'thursday'},
				{name: 'Friday', value: 'friday'},
				{name: 'Saturday', value: 'saturday'},
				{name: 'Sunday', value: 'sunday'}
			))
        .addStringOption(option => option
			.setName('date')
			.setDescription('Add a date (DD-MM-YYYY)')),

	async execute(interaction) {
		let dayDate = interaction.options.getString('day');
		let date = interaction.options.getString('date');

        if (!date) {
			if (dayDate) {
				date = getDateFromString(dayDate)
			} else {
				date = "today";
			}
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