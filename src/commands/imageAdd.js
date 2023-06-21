const { SlashCommandBuilder } = require('@discordjs/builders');
const { addToMap, getImageUrl } = require('../utils/userImages/userImages'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Adds a cool image associated with you')
    .addStringOption(option => option.setName('input').setDescription('Enter a URL for your image').setRequired(true)),
	async execute(interaction) {
    const imageURL = interaction.options.getString('input');
    addToMap(interaction.user.id, imageURL);

    const imageEmbed = {
      color: 0x8300FF,
      title: 'You associated this image with yourself',
      image: {
        url: getImageUrl(interaction.user.id)
      }
    }
    await interaction.reply({ embeds: [imageEmbed] })
	},
};