const { SlashCommandBuilder } = require('@discordjs/builders');
const { constructEmbed } = require('../calendars/calendar');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('where')
		.setDescription('Where is a specific user?')
        .addUserOption(option => option.setName('target').setDescription('User to find').setRequired(true))
		.addStringOption(option => option.setName('date').setDescription('Add a date (DD-MM-YYYY)')),
	async execute(interaction) {
        let target = interaction.options.getUser('target');
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


        let onCampusEmbed = await constructEmbed(interaction.client, target.id, date);

        await interaction.reply({ embeds: [onCampusEmbed] })
	},
};