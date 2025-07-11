import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('uranai')
  .setDescription('ラッキーアイテムを占うよ～');

export async function execute(interaction){
  const arr = ["ヴァンダル", "ファントム", "オペレーター", "オーディン", "シェリフ","ジャッジ"]
  const random = Math.floor( Math.random() * arr.length);
  const color = arr[random];

	await interaction.reply(`ラッキーアイテムは${color}だよ～`);
}
