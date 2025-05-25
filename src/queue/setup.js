const { Agenda, Job } = require("agenda");
const { transcript } = require("../transcript.js");
const { dbget, incrementCount } = require("../dbfunc.js");
const { Bot, InputFile, Context } = require("grammy");
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);
const queue = new Agenda({
  db: {
    address: process.env.MONGO_URL,
  },
});
exports.connectAgenda = async () => {
  queue.define("image", imageProcess);

  console.log("Connected to agenda");
  await queue.start();
};
exports.queue = queue;

async function fetchImage(txt, font, color) {
  const { default: fetch } = await import("node-fetch");
  return await fetch(
    `${process.env.PNG_API}/image?text=${txt}&font=${font}&color=${color}`
  );
}
/**
 *
 * @param {Job} job
 * @returns
 */
async function imageProcess(job) {
  try {
    console.log("Running job");
    if (job.attrs.data.retries) {
      console.log("This is retry number:", job.attrs.data.retries);
    }
    const ctx = job.attrs?.data?.ctx;
    let msg = job.attrs?.data?.msg;
    if (!ctx || !msg) return;
    await dbget(ctx.message.from.id, async (row) => {
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
    });
  } catch (e) {
    console.log(e);
    const retries = job.attrs.data?.retries || 0;
    if (retries < 3) {
      console.log("Retrying job in 1 minute...");
      await queue.schedule("in 1 minute", "image", {
        ...job.attrs.data,
        retries: retries + 1,
      });
    }
  }
}
