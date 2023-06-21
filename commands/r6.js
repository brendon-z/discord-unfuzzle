const { SlashCommandBuilder } = require('@discordjs/builders');
const { playerStats, validPlayer, playerDetails } = require('../gameStats/r6stats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('r6')
		.setDescription('Gets r6 stats for player')
    .addStringOption(option => option.setName('input').setDescription('Enter the uplay name').setRequired(true)),
  async execute(interaction) {
    const uplayName = interaction.options.getString('input');
		await interaction.deferReply();

    if (await validPlayer(uplayName) === false) {
      await interaction.editReply(`${uplayName} doesn\'t play R6!`);
    } else {
      const r6PlayerStats = await playerStats('uplay', uplayName);
      const r6PlayerDetails = await playerDetails('uplay', uplayName);
      const statEmbed = {
        color: 0x2600DC,
        title: 'Unfuzzle R6 Stats',
        description: `Stats for ${uplayName}`,
        fields: [
          {
            name: 'Matches played',
            value: `${r6PlayerStats.pvp.general.matches}`,
          },
          {
            name: 'Kill-death',
            value: `${r6PlayerStats.pvp.general.kills} kills / ${r6PlayerStats.pvp.general.deaths} = ${(r6PlayerStats.pvp.general.kills / r6PlayerStats.pvp.general.deaths).toFixed(2)} KD`,
            inline: true,
          },
          {
            name: 'Headshots',
            value: `${r6PlayerStats.pvp.general.headshots} kills / ${r6PlayerStats.pvp.general.deaths} = ${(r6PlayerStats.pvp.general.headshots / r6PlayerStats.pvp.general.kills).toFixed(2)} HS ratio`,
            inline: true,
          },
          {
            name: 'Win-loss',
            value: `${r6PlayerStats.pvp.general.wins} wins / ${r6PlayerStats.pvp.general.losses} = ${(r6PlayerStats.pvp.general.wins / r6PlayerStats.pvp.general.losses).toFixed(2)} WL ratio`
          }
        ],
        image: {
          url: r6PlayerDetails.avatar[500],
        },      
      }
      await interaction.editReply({ embeds: [statEmbed] })
    }
	},
};