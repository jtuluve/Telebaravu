import { webhookCallback, Bot, InlineKeyboard, InputFile } from "grammy";
import express, { json } from "express";
import { connectDB, dbcreate, dbget, dbupdate, dbdelete, User } from "./dbfunc";
import dotenv from "dotenv";
import https from "https";
import { URL } from "url";

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN!);
// Bot code

bot.command(process.env.BROADCAST_CODE!, async (ctx) => {
  const message = ctx.message!.text.slice(process.env.BROADCAST_CODE!.length + 1).trim();

  if (!message) {
    return await ctx.reply("Please provide a message to broadcast.");
  }

  await ctx.reply("Broadcasting message...");
  await fireAndForgetBroadcast(message);
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
  const userId = ctx.from?.id;
  const text = ctx.message.text;

  if (!userId || !text) return;

  const waitMsg = await ctx.api.sendMessage(userId, "It will take some time for me to generate PNG. Please wait... 😇");

  try {
    const row = await dbget(userId);
    const font = row?.font || "baravu";
    const color = row?.color || "red";
    const encodedText = encodeURIComponent(text);
    
    console.log("Recieved:", text);
    console.log("Encoded:", encodedText);

    const res = await fetch(`${process.env.PNG_API}/image?text=${encodedText}&font=${font}&color=${color}`);
    const data = await res.json();

    if (!data.url) throw new Error("No image URL in response");

    await ctx.api.sendDocument(userId, new InputFile({url: data.url}, "image.png"));

    await ctx.api.deleteMessage(userId, waitMsg.message_id);
  } catch (e) {
    console.error("Failed to process image:", e);
    await ctx.api.sendMessage(userId, "Something went wrong while generating the image 😓");
  }
});

bot.on("message", async (ctx) => {
  return await ctx.reply("👀");
});


export default bot;

async function fireAndForgetBroadcast(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(`${process.env.HOSTED_URL}/broadcast`);
      const data = JSON.stringify({
        code: process.env.BROADCAST_SECRET,
        message,
      });

      const options = {
        method: "POST",
        hostname: url.hostname,
        path: url.pathname,
        port: url.port || 443,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
        // Immediately consume response to avoid memory leaks
        res.resume();
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.write(data);
      // Resolve only when request has finished sending
      req.on("finish", () => {
        resolve();
      });

      if(req.writableFinished){
        resolve();
        req.end(); 
      }
    } catch (err) {
      reject(err);
    }
  });
}
