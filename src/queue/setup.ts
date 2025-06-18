import { Agenda, Job } from "agenda";
import { Bot, InputFile, Context } from "grammy";
import { Message } from "grammy/types";

import { transcript } from "../transcript";
import { dbget, incrementCount, User } from "../dbfunc";
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);
export const queue = new Agenda({
  db: {
    address: process.env.MONGO_URL,
  },
});
export const connectAgenda = async () => {
  queue.define("image", imageProcess);

  console.log("Connected to agenda");
  await queue.start();
};

async function fetchImage(txt: string, font: string, color: string) {
  return await fetch(
    `${process.env.PNG_API}/image?text=${txt}&font=${font}&color=${color}`
  );
}

async function imageProcess(job: Job<{ ctx: Context["update"], retries: number, msg: Message }>) {
  try {
    console.log("Running job");
    if (job.attrs.data.retries) {
      console.log("This is retry number:", job.attrs.data.retries);
    }
    const ctx = job.attrs?.data?.ctx;
    let msg = job.attrs?.data?.msg;
    if (!ctx || !msg) return;
    const row = await dbget(ctx.message.from.id);
    let txt = ctx.message.text;

    txt = transcript(txt);
    txt = encodeURIComponent(txt);
    let color = row ? row.color : "red";
    let font = row ? row.font : "baravu";
    let response = await fetchImage(txt, font, color);

    response = await response.json();
    await bot.api.sendDocument(
      ctx.message.from.id,
      new InputFile(new URL(response.url), "image.png")
    );
    bot.api.deleteMessage(ctx.message.from.id, msg.message_id);
    incrementCount(ctx.message.from.id);
  } catch (e) {
    console.log(e);
    const retries = job.attrs.data?.retries || 0;
    if (retries < 3) {
      console.log("Retrying job in 1 minute...");
      setTimeout(async () => await queue.now("image", {
        ...job.attrs.data,
        retries: retries + 1,
      }), 60000)
    }
  }
}
