const { SlashCommandBuilder } = require('@discordjs/builders');
const stringUnjumble = require('../utils/string_unjumble.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fuzzle')
		.setDescription('Fuzzles the message last sent in the channel')
    .addStringOption(option => option.setName('input').setDescription('Enter a string instead?')),
	async execute(interaction) {
    const stringOption = interaction.options.getString('input');
    let channel = interaction.channel;

    if (stringOption) {
      const fuzzledMessage = stringUnjumble(stringOption, 'n');
      await interaction.reply(`${fuzzledMessage}`);
    } else {
      channel.messages.fetch({ limit: 2 }).then(messages => {
        let latestMessage = messages.first();
        const fuzzledMessage = stringUnjumble(latestMessage.content, 'n');
        interaction.reply(`${fuzzledMessage}`);
      });
    }
	},
};