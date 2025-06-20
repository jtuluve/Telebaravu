import express, { json } from "express";
import { webhookCallback } from "grammy";
import bot from "./bot";
import { connectDB } from "./dbfunc";
import { connectAgenda } from "./queue/setup";
const app = express();
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    await bot.api.setWebhook(process.env.HOSTED_URL!, {
      secret_token: process.env.WEBHOOK_TOKEN,
    });
    // Use Webhooks for prod
    app.get("/", (_req, res) => res.send("Hello World!"));
    app.use(json());
    app.use(
      webhookCallback(bot, "express", "throw", 90000, process.env.WEBHOOK_TOKEN)
    );

    const PORT = process.env.PORT;
    await connectDB();
    await connectAgenda();
    app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
    });
  } else {
    // Use Long Polling for development
    connectDB().then(() => connectAgenda().then(() => bot.start()));
  }
}
startServer();
export default app;