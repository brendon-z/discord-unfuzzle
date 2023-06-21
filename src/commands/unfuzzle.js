const { SlashCommandBuilder } = require('@discordjs/builders');
const stringUnjumble = require('../utils/string_unjumble.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unfuzzle')
		.setDescription('Unfuzzles the message last sent in the channel'),
	async execute(interaction) {
    let channel = interaction.channel;

    channel.messages.fetch({ limit: 2 }).then(messages => {
      let fuzzledMessage = messages.first();
      const unfuzzledMessage = stringUnjumble(fuzzledMessage.content, 'n');
      interaction.reply(`The unfuzzled message:\n ${unfuzzledMessage}`);
    });
	},
};