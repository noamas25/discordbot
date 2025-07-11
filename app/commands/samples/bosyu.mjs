import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("bosyu")
  .setDescription("募集を開始しまーす")
  .addIntegerOption(option =>
    option.setName("参加人数")
      .setDescription("参加人数を指定してね")
      .setRequired(true)
      .setMinValue(1)
  )
  .addStringOption(option =>
    option.setName("game")
      .setDescription("募集するゲームまたは内容を入力してね")
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName("開始時間")
      .setDescription("開始時間を入力してね (例: 3時間後、19時)入力なしでもOK")
  )
  .addStringOption(option =>
    option.setName("終了時間")
      .setDescription("終了時間を入力してね 入力なしでもOK")
  )
  .addStringOption(option =>
    option.setName("備考")
      .setDescription("備考を入力してね")
  );

export async function execute(interaction){
  const participants = interaction.options.getInteger("参加人数");
  const game = interaction.options.getString("game");
  const duration = interaction.options.getString("開始時間");
  const endtime = interaction.options.getString("終了時間");
  const note = interaction.options.getString("備考");
  if (participants <= 0) {
    return await interaction.reply({ content: "参加人数は1以上を指定してね。", ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle(`${game}募集中`)
    .addFields(
      { name: "募集人数", value: `${participants}人`, inline: true },
      { name: "現在の状況", value: "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。", inline: false }
    )
    .setColor("Random")
    .setTimestamp();

  if (duration) {
    embed.addFields({ name: "開始時間", value: duration, inline: false });
  }
  if (endtime) {
    embed.addFields({ name: "終了時間", value: endtime, inline: false });
  }
  if (note) {
    embed.addFields({ name: "備考", value: note, inline: false });
  }

  const join =new ButtonBuilder()
    .setCustomId("join")
    .setLabel("参加")
    .setStyle(ButtonStyle.Primary);

  const retire =new ButtonBuilder()
    .setCustomId("retire")
    .setLabel("不参加")
    .setStyle(ButtonStyle.Primary);
  
  const late =new ButtonBuilder()
    .setCustomId("late")
    .setLabel("遅れる")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(join,retire,late); //ボタンを表示する

  const reply = await interaction.reply({
    content: `@everyone \n<@${interaction.user.id}>さんが${game}で募集を開始するよー。\n参加予定人数${participants}`,
    components: [row],
    embeds: [embed],
    fetchReply: true
  });

  const results={};
  let collectedCount=0;　//ボタンを押した人をカウント
  let joinedCount = 0; // 参加者の数をカウント

  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.customId === 'join' || i.customId === 'retire' || i.customId ==='late',
    time: 60000 * 1440,
  });

  collector.on("collect",async i =>{
    console.log("collect on");
    if (!results[i.user.id]) {
      results[i.user.id] = i.customId;
      collectedCount++;
      if (i.customId === 'join' || i.customId === 'late') {
        joinedCount++; // 参加者が増えたらカウントアップ
      }
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]); // 元のEmbedをコピー

      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加"};
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";

      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }

      await i.update({ embeds: [updatedEmbed], components: [row] });

    } else if (results[i.user.id] === 'retire' && i.customId === 'join') {
      console.log("retire->join")
      results[i.user.id] = 'join';
      joinedCount++;
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加" };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    } else if (results[i.user.id] === 'join' && i.customId === 'retire') {
      console.log("リタイアしました");
      results[i.user.id] = 'retire';
      joinedCount--;
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加" };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    } else if (results[i.user.id] === 'retire' && i.customId === 'late') {
      console.log("retire->late");
      results[i.user.id] = 'late';
      joinedCount++;
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加",late:'遅れて参加' };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    }else if (results[i.user.id] === 'late' && i.customId === 'retire') {
      console.log("リタイアしました");
      results[i.user.id] = 'retire';
      joinedCount--;
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加" };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    } else if (results[i.user.id] === 'late' && i.customId === 'join') {
      console.log("late->join");
      results[i.user.id] = 'join';
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加" };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    }else if (results[i.user.id] === 'join' && i.customId === 'late') {
      console.log("join->late");
      results[i.user.id] = 'late';
      const updatedEmbed = new EmbedBuilder(reply.embeds[0]);
      const statusText = Object.entries(results)
        .map(([userId, status]) => {
          const sanka = { join: "参加", retire: "不参加" ,late:"遅れて参加" };
          return `<@${userId}>: ${sanka[status]}`;
        })
        .join('\n') || "まだ誰も参加/不参加を表明していないよ(´;ω;｀)。";
      updatedEmbed.setFields(
        { name: "募集人数", value: `${participants}人`, inline: true },
        { name: "現在の状況", value: statusText, inline: false }
      );
      if (duration) {
        updatedEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        updatedEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        updatedEmbed.addFields({ name: "備考", value: note, inline: false });
      }
      await i.update({ embeds: [updatedEmbed], components: [row] });

    }else {
      console.log("返答重複エラー")
      await i.reply({ content: "返答済みだよーやにかす。", ephemeral: true });
    }

    // 参加人数が募集人数に達したら募集を終了
    if (joinedCount === participants) {
      collector.stop();
      console.log("参加人数が募集人数に達したら募集を終了");
      const sanka = { join: "参加", retire: "不参加",late:"遅れて参加" };
      const resultMessages = [];

      for (const userId in results) {
        const playerStatus = sanka[results[userId]];
        try {
          const user = await interaction.guild.members.fetch(userId);
          let resultText = `<@${userId}> (${playerStatus})`;
          resultMessages.push(resultText);
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました:", error);
          let resultText = `<@${userId}> (${playerStatus})`;
          resultMessages.push(resultText);
        }
      }

      const finalMessage = `募集結果 (${participants}人):\n${resultMessages.join('\n')}`;
      await interaction.followUp(finalMessage);

    } else {
      await i.followUp({ content: `現在 ${Object.values(results).filter(status => status === 'join'||status==='late').length}/${participants} 人が参加、${Object.values(results).filter(status => status === 'retire').length} 人が不参加だよ。`, ephemeral: true });
    }
  });

  collector.on("end", async collected => {
    console.log("collector endが実行されたよ", collectedCount, participants);
    const finalEmbed = new EmbedBuilder(reply.embeds[0]);

    const sanka = { join: "参加", retire: "不参加",late:"遅れて参加" };
    const resultMessages = await Promise.all(
      Object.entries(results).map(async ([userId, status]) => {
        try {
          const user = await interaction.guild.members.fetch(userId);
          return `<@${userId}> (${sanka[status]})`;
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました:", error);
          return `<@${userId}> (${sanka[status]})`;
        }
      })
    );

    finalEmbed.setFields(
      { name: "募集人数", value: `${participants}人`, inline: true },
      { name: "現在の状況", value: resultMessages.join('\n') || "誰も参加しませんでした(´;ω;｀)。", inline: false }
    );
      if (duration) {
        finalEmbed.addFields({ name: "開始時間", value: duration, inline: false });
      }
      if (endtime) {
        finalEmbed.addFields({ name: "終了時間", value: endtime, inline: false });
      }
      if (note) {
        finalEmbed.addFields({ name: "備考", value: note, inline: false });
      }

    if (joinedCount < participants && Object.values(results).filter(status => status === 'join'||status==='late').length < participants) {
      await interaction.followUp(`募集を終了するね。${Object.values(results).filter(status => status === 'join'||status==='late').length}/${participants}人。`);
    } else {
      await interaction.followUp("募集を終了するね！");
    }

    await reply.edit({ embeds: [finalEmbed], components: [] });
  });
}