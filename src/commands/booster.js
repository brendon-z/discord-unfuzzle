import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
		.setName('booster')
		.setDescription('Checks whether the target is a booster or not!')
		.addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		let target = interaction.options.getUser('target');

		if (!target) {
			target = interaction.user
		}
		let member = interaction.guild.members.cache.get(target.id);

		if (member.premiumSince) {
		await interaction.reply(`${target.username} is a server booster and is very cool`);
		} else {
		await interaction.reply(`${target.username} is not a server booster and is very uncool`);
		}
	},
};