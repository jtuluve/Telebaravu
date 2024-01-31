const { Agenda } = require("agenda");
const { transcript } = require("../transcript");
const { dbget, incrementCount } = require("../dbfunc");
const { Bot, InputFile } = require("grammy");
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
    `https://tulu-png-api2.glitch.me/image?text=${txt}&font=${font}&color=${color}`
  );
}

async function imageProcess(job) {
  const ctx = job.attrs?.data?.ctx;
  let msg = job.attrs?.data?.msg;
  if(!ctx || !msg) return;
  await dbget(ctx.message.from.id, async (row) => {
    let txt = ctx.message.text;

    txt = transcript(txt);
    txt = encodeURIComponent(txt);
    let color = row ? row.color : "red";
    let font = row ? row.font : "baravu";
    try {
      let response = await fetchImage(txt, font, color);

      response = await response.json();
      await bot.api.sendDocument(
        ctx.message.from.id,
        new InputFile(new URL(response.url), "image.png")
      );
      bot.api.deleteMessage(ctx.message.from.id, msg.message_id);
      incrementCount(ctx.message.from.id);
    } catch (e) {
      console.error(e);
    }
  });
}
