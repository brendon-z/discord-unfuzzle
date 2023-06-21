import { SlashCommandBuilder } from '@discordjs/builders';
import { addCalendar } from '../utils/calendars/calendar.js';

export default {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Add your uni calendar to my database (UNSW only)')
    .addStringOption(option => option.setName('input').setDescription('Enter your iCal link').setRequired(true)),
	async execute(interaction) {
		let calLink = interaction.options.getString('input');
		calLink = calLink.replace("webcal", "http")
		addCalendar(interaction.user.id, calLink);

		const calendarInfo = {
			color: 0x8300FF,
			title: 'You added a calendar link',
			fields: [
				{
					name: 'Calendar link',
					value: calLink
				}
			]
		}
		await interaction.reply({ embeds: [calendarInfo] })
	},
};