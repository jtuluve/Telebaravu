(async()=>{


const { webhookCallback, Bot, InlineKeyboard, InputFile } = require("grammy");

const express = require("express");
const {default:fetch} = await import("node-fetch")
const { transcript } = require("./transcript");
const { connectDB, dbcreate, dbget, dbupdate, incrementCount, dbdelete } = require("./dbfunc");
//database

const bot = new Bot(process.env.BOT_TOKEN);
// Bot code

bot.command(process.env.BROADCAST_CODE,(ctx)=>{
  let message = ctx.message.text.slice(process.env.BROADCAST_CODE.length+1);
  broadcastMessage(message);
  return ctx.reply("Broadcasting message.")
})

bot.on("message", async (ctx, next) => {
  try {
    await dbcreate(ctx.message.from.id);
    fetch(`https://tulu-png-api2.glitch.me/`);
  } catch (e) {
    console.error("line 25: ", e);
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
  await dbget(ctx.message.from.id, async (row) => {
    let txt = ctx.message.text;

    txt = transcript(txt);
    txt = encodeURIComponent(txt);
    let color = row ? row.color : "red";
    let font = row ? row.font : "baravu";
    try {
      let response = await fetch(
        `https://tulu-png-api2.glitch.me/image?text=${txt}&font=${font}&color=${color}`
      );

      response = await response.json();
      await ctx.replyWithDocument(
        new InputFile(new URL(response.url), "image.png")
      );
      bot.api.deleteMessage(ctx.message.from.id, msg.message_id);
      incrementCount(ctx.message.from.id)
    } catch (e) {
      console.error(e);
    }
  });
});

// Start the server
if (process.env.NODE_ENV === "production") {
  bot.api.setWebhook(
    process.env.CYCLIC_URL , {
    secret_token: process.env.WEBHOOK_TOKEN,
    
  });
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot,"express","throw",90000,process.env.WEBHOOK_TOKEN));

  const PORT = process.env.PORT;
  connectDB().then(() =>
    app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
    })
  );
} else {
  // Use Long Polling for development
  connectDB().then(()=>bot.start())
}




async function broadcastMessage(message) {
  const users = await dbget();
  for (const user of users) {
    let userId = user.userid;
    try {
      await bot.api.sendMessage(userId, message);
    } catch (error) {
      // Check if it's a rate limit error
      if (error.code === 429) {
        // The 'parameters' field provides info about the rate limit
        const waitTime = error.parameters.retry_after;
        await new Promise(resolve => setTimeout(resolve, waitTime * 1001)); // Wait for the specified time

        // Once the wait is over, attempt to send the message again
        await bot.api.sendMessage(userId, message);
      } else {
        console.log(`Failed to send message to ${userId}:`, error);
        await dbdelete(userId);
      }
    }
  }
}



})()


