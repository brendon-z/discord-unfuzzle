import { SlashCommandBuilder } from '@discordjs/builders';
import { constructEmbed, getDateFromString } from '../utils/calendars/calendar.js';

export default {
	data: new SlashCommandBuilder()
		.setName('where')
		.setDescription('Where is a specific user?')
        .addUserOption(option => option.setName('target').setDescription('User to find').setRequired(true))
		.addStringOption(option => option.setName('day').setDescription('Get their timetable on a particular day')
			.addChoices(
				{name: 'Monday', value: 'monday'},
				{name: 'Tuesday', value: 'tuesday'},
				{name: 'Wednesday', value: 'wednesday'},
				{name: 'Thursday', value: 'thursday'},
				{name: 'Friday', value: 'friday'},
				{name: 'Saturday', value: 'saturday'},
				{name: 'Sunday', value: 'sunday'}
			))
		.addStringOption(option => option.setName('date').setDescription('Get their timetable on (DD-MM-YYYY)')),
	async execute(interaction) {
		let target = interaction.options.getUser('target');
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


        let onCampusEmbed = await constructEmbed(interaction.client, target.id, date);

        await interaction.reply({ embeds: [onCampusEmbed] })
	},
};