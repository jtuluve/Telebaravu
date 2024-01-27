const { webhookCallback, Bot, InlineKeyboard, InputFile } = require("grammy");

const express = require("express");
const axios = require("axios");
const { transcript } = require("./transcript");
const { connectDB, dbcreate, dbget, dbupdate } = require("./dbfunc");

//database

const bot = new Bot(process.env.BOT_TOKEN);
//const http = require('https');
// Bot code
//bot.telegram.setWebhook('https://mesquite-private-jay.glitch.me/');
bot.on("message", (ctx, next) => {
  console.log(ctx);
  dbcreate(ctx.chat.id);
  axios.get(`https://tulu-png-api2.glitch.me/`);
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
  await dbupdate(ctx.update.callback_query.from.id, ["color"], [ctx.match[1]]);
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
  dbupdate(ctx.update.callback_query.from.id, ["font"], [ctx.match[1]]);
  return;
});

bot.command("mycolor", (ctx) => {
  dbget(ctx.message.from.id, (row) => {
    if (row) ctx.reply(`Your default png color is ${row.color || "red"}`);
    else ctx.reply("Your default png color is red");
  });
});

bot.command("myfont", (ctx) => {
  dbget(ctx.message.from.id, (row) => {
    if (row) ctx.reply(`Your default png font is ${row.font}`);
    else ctx.reply("Your default png font is baravu");
  });
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
  dbget(ctx.message.from.id, async (row) => {
    console.log(row)
    let txt = ctx.message.text;

    txt = transcript(txt);
    txt = encodeURIComponent(txt);
    let color = row ? row.color : "red";
    let font = row ? row.font : "baravu";

    axios
      .get(
        `https://tulu-png-api2.glitch.me/image?text=${txt}&font=${font}&color=${color}`
      )
      .then(async (response) => {
        await ctx.replyWithDocument(
          new InputFile(new URL(response.data.url), "image.png")
        );
        bot.api.deleteMessage(ctx.message.from.id, msg.message_id);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// Start the server
if (process.env.NODE_ENV === "production") {
  bot.api.setWebhook(process.env.CYCLIC_URL/* , {
    secret_token: process.env.WEBHOOK_TOKEN,
  } */);
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT;
  connectDB().then(() =>
    app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
    })
  );
} else {
  // Use Long Polling for development
  bot.start();
}
