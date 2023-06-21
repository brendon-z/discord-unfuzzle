import { SlashCommandBuilder } from '@discordjs/builders';
import { getRecentGames, getSteamDetails } from '../utils/gameStats/steamStats.js';
import moment from 'moment';

export default {
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('Gets steam stats for user')
    .addStringOption(option => option.setName('input').setDescription('Enter the steamId').setRequired(true)),
  	async execute(interaction) {
		const steamId = interaction.options.getString('input');
			await interaction.deferReply();

		if (await getSteamDetails(steamId) === -1) {
			await interaction.editReply(`${steamId} doesn\'t use Steam!`);
		} else {
			const steamStats = await getSteamDetails(steamId);
			const recentGames = await getRecentGames(steamId);
			const statEmbed = {
				color: 0x2600DC,
				title: 'Unfuzzle Steam Stats',
				description: `Stats for ${steamStats.name}`,
				fields: [
					{
						name: 'Joined Steam',
						value: `${moment(steamStats.joined).format('MMMM Do YYYY, h:mm:ss a')}`,
					},
					{
						name: 'Recently played games',
						value: `${recentGames.games.map(g => (' ' + g.name))}`,
					},
				],
				image: {
					url: steamStats.avatar.large
				},      
			}

			await interaction.editReply({ embeds: [statEmbed] })
		}
	},
};