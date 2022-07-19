const { SlashCommandBuilder } = require('@discordjs/builders');
const stringUnjumble = require('../string_unjumble.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fuzzle')
		.setDescription('Fuzzles the message last sent in the channel')
    .addStringOption(option => option.setName('input').setDescription('Enter a string instead?')),
	async execute(interaction) {
    const stringOption = interaction.options.getString('input');
    let channel = interaction.channel;

    if (stringOption) {
      await interaction.reply(`${stringUnjumble(stringOption, 'n')}`);
    } else {
      channel.messages.fetch({ limit: 2 }).then(messages => {
        let latestMessage = messages.first();
        interaction.reply(`${stringUnjumble(latestMessage.content, 'n')}`);
      });
    }
	},
};