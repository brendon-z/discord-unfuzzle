const { SlashCommandBuilder } = require('@discordjs/builders');
const scraelmbr = require('scraelmbr');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scraembl')
		.setDescription('Scraembls a message in a readable way')
    .addStringOption(option => option.setName('input').setDescription('Enter a string instead?')),
	async execute(interaction) {
    const stringOption = interaction.options.getString('input');
    let channel = interaction.channel;

    if (stringOption) {
      await interaction.reply(`${scraelmbr(stringOption)}`);
    } else {
      channel.messages.fetch({ limit: 2 }).then(messages => {
        const scrambledMessage = scraelmbr(messages.first());
        interaction.reply(`${scrambledMessage}`);
      });
    }
	},
};