const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Repeats the last message sent in a channel'),
	async execute(interaction) {
    let channel = interaction.channel;

    channel.messages.fetch({ limit: 2 }).then(messages => {
      let lastMessage = messages.first();
      interaction.reply(`The last message was: ${lastMessage.content} by ${lastMessage.author.username}#${lastMessage.author.discriminator}`);
    });
	},
};