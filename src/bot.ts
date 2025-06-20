import { connectAgenda, queue } from "./queue/setup.js";
import { webhookCallback, Bot, InlineKeyboard } from "grammy";
import express, { json } from "express";
import { connectDB, dbcreate, dbget, dbupdate, dbdelete, User } from "./dbfunc";

const bot = new Bot(process.env.BOT_TOKEN!);
// Bot code

bot.command(process.env.BROADCAST_CODE!, (ctx) => {
  let message = ctx.message!.text.slice(process.env.BROADCAST_CODE!.length + 1);
  broadcastMessage(message);
  return ctx.reply("Broadcasting message.");
});

bot.on("message", async (ctx, next) => {
  try {
    await dbcreate(ctx.message.from.id);
    fetch(process.env.PNG_API!);
  } catch (e) {
    console.error(e);
  }
  return next();
});

bot.command("start", (ctx) => {
  ctx.reply(
    "<b>Hello there!! Read this before using the bot</b>\nI can send a png image in <b>Tulu script</b> if you provide the text in <b>Kannada or Malayalam script</b>. \n You can select your own color and font. \nFor a list of available commands send /commands or /help.",
    { parse_mode: "HTML" }
  );
});

bot.command(["commands", "command", "help"], (ctx) => {
  ctx.reply(
    "*Here is a list of available commands and their  short description:*\n/start \\- Get started\\!\\!\n/image \\- Generate png image\n/setfont \\- Set font for png text\n/setcolor \\- set color for png text\n/myfont \\- currently selected font\n/mycolor \\- currently selected color\n/commands \\- get a list of available commands",
    { parse_mode: "MarkdownV2" }
  );
});

// Command to set user color
bot.command("setcolor", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .row(
      { text: "Black", callback_data: "setcolor black" },
      { text: "White", callback_data: "setcolor white" },
      { text: "Red", callback_data: "setcolor red" }
    )
    .row(
      { text: "Green", callback_data: "setcolor green" },
      { text: "Blue", callback_data: "setcolor blue" },
      { text: "Yellow", callback_data: "setcolor yellow" }
    )
    .row(
      { text: "Cyan", callback_data: "setcolor cyan" },
      { text: "Gray", callback_data: "setcolor gray" },
      { text: "Orange", callback_data: "setcolor orange" }
    )
    .row(
      { text: "Brown", callback_data: "setcolor brown" },
      { text: "Purple", callback_data: "setcolor purple" },
      { text: "Pink", callback_data: "setcolor pink" }
    )
    .row(
      { text: "Maroon", callback_data: "setcolor maroon" },
      { text: "Violet", callback_data: "setcolor violet" },
      { text: "Gold", callback_data: "setcolor gold" }
    );

  await ctx.reply("Choose color:", {
    reply_markup: keyboard,
  });
});

//user color set action
bot.callbackQuery(/setcolor (.+)/, async (ctx) => {
  await dbupdate(ctx.update.callback_query.from.id, { color: ctx.match[1] });
  ctx.reply(`Your color has been updated to ${ctx.match[1]}`);
  return;
});

bot.command("setfont", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("Baravu", "setfont baravu")
    .text("Mandara", "setfont mandara")
    .text("Allige", "setfont allige");

  await ctx.reply("Choose font:", {
    reply_markup: keyboard,
  });
});

//user font set action
bot.callbackQuery(/setfont (.+)/, (ctx) => {
  ctx.reply(`Your font has been updated to: ${ctx.match[1]}`);
  dbupdate(ctx.update.callback_query.from.id, { font: ctx.match[1] });
  return;
});

bot.command("mycolor", async (ctx) => {
  const row = await dbget(ctx.message!.from.id);
  ctx.reply(`Your default png color is ${row?.color || "red"}`);
});

bot.command("myfont", async (ctx) => {
  const row = await dbget(ctx.message!.from.id);
  ctx.reply(`Your default png font is ${row?.font || "baravu"}`);
});


bot.command("image", (ctx) => {
  ctx.reply(
    "Send me the text in Kannada or Malyalam (in Tulu language) to get png image."
  );
});

bot.on("message:sticker", (ctx) => ctx.reply("❤️"));

bot.on("message:text", async (ctx) => {
  let msg = await bot.api.sendMessage(
    ctx.message.from.id,
    "It will take some time for me to generate png. Please wait..😇"
  );
  queue.now("image", { ctx: ctx.update, msg });
});

bot.on("message", async (ctx) => {
  return await ctx.reply("👀");
});



async function broadcastMessage(message: string) {
  const users = await dbget();

  for (let i = 0; i < users.length; i++) {
    let userId = users[i].userid;
    try {
      await bot.api.sendMessage(userId, message);
    } catch (error) {
      // Check if it's a rate limit error
      if (error.code === 429) {
        const waitTime = error.parameters.retry_after;
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1001));
        i--;
      } else {
        console.log(`Failed to send message to ${userId}:`, error);
        await dbdelete(userId);
      }
    }
  }
}


export default bot;
