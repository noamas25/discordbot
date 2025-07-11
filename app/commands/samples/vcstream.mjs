import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,  
}from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("vcstream")
  .setDescription("vcに参加するよ");

export async function execute(interaction){
  const member = interaction.member;
  const voiceChannel = member.voice.channel;
  
  if(!voiceChannel){
    await interaction.reply({content:"先にvcに参加してね",ephemeral: true });
    return;
  }
  try{
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
    });
    
    await entersState(connection, VoiceConnectionStatus.Ready, 30000);
    
    await interaction.reply({
      content: `\`${voiceChannel.name}\` に参加しました！`,
      ephemeral: true, 
    });
    
  }catch (error) {
      console.error(error);
      await interaction.reply({ content: 'ボイスチャンネルへの参加中にエラーが発生しました。', ephemeral: true });
    }
}