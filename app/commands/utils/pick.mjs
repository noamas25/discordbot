import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('pick')
  .setDescription('ランダムにエージェントを選ぶよ')
  .addStringOption(option =>
    option
      .setName('role')
      .setDescription('due,ini,con,sen形式で入力してね')
      .setRequired(false)
  );

export async function execute(interaction){
  const role = interaction.options.getString("role")
	await interaction.reply(rolePick(role));
}

export function rolePick(role){
    const all = [
    "ジェット",
    "フェニックス",
    "セージ",
    "ソーヴァ",
    "ブリムストーン",
    "ヴァイパー",
    "サイファー",
    "レイズ",
    "キルジョイ",
    "レイナ",
    "オーメン",
    "ブリーチ",
    "スカイ",
    "ヨル",
    "アストラ",
    "KAY/O",
    "チェンバー",
    "ネオン",
    "フェイド",
    "ハーバー",
    "ゲッコー",
    "デッドロック",
    "アイソ",
    "ヴァイス",
    "テホ",
    "ウェイレイ",
    "クローブ"
  ]
  const due = [
    "ジェット",
    "フェニックス",
    "レイズ",
    "ヨル",
    "レイナ",
    "ネオン",
    "アイソ",
    "ウェイレイ"
  ]
  const ini = [
    "ソーヴァ",
    "ブリーチ",
    "スカイ",
    "KAY/O",
    "フェイド",
    "ゲッコー",
    "テホ"
  ]
  const con = [
    "ブリムストーン",
    "ヴァイパー",
    "オーメン",
    "アストラ",
    "ハーバー",
    "クローブ"
  ]
  const sen = [
    "セージ",
    "サイファー",
    "チェンバー",
    "キルジョイ",
    "デッドロック",
    "ヴァイス"
  ]
  const ego=[
    "レイナ",
    "アイソ",
    "フェニックス",
    "ネオン",
    "ヨル",
    "ゲッコー",
    "テホ",
    "クローブ",
    "ハーバー",
    "デッドロック",
    "チェンバー",
    "セージ",
    "ヴァイス"
  ]
  
  let arr=[]
  
  
  if(role=="due"){
    arr=due;
  }
    else if(role=="sen"){
    arr=sen;
  }
    else if(role=="ini"){
    arr=ini;
  }
    else if(role=="con"){
    arr=con;
  }
  else if(role=="ego"){
    arr=ego;
  }
    else{
      arr=all;
  }
  
  const random = Math.floor( Math.random() * arr.length);
  const color = arr[random];

  return `君は${color}！^-^`;

}