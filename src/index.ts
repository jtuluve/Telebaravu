import express, { json } from "express";
import { webhookCallback } from "grammy";
import bot from "./bot";
import { connectDB, dbdelete, dbget } from "./dbfunc";
import { connectAgenda } from "./queue/setup";
import dotenv from "dotenv";
dotenv.config();
const app = express();
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    // await bot.api.setWebhook(process.env.HOSTED_URL!, {
    //   secret_token: process.env.WEBHOOK_TOKEN,
    // });
    // Use Webhooks for prod
    app.get("/", (_req, res) => res.send("Hello World!"));
    app.use(json());
    app.post("/broadcast", async (req, res) => {
      try {
        const { code, message } = req.body;
    
        // Validate the secret code
        if (code !== process.env.BROADCAST_SECRET) {
          return res.status(401).json({ success: false, message: "Invalid code." });
        }
        await broadcastMessage(message)
    
      } catch (error) {
        console.error("Error handling broadcast:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    });
    app.use(
      webhookCallback(bot, "express", "throw", 90000, process.env.WEBHOOK_TOKEN)
    );

    await connectDB();
  } else {
    // Use Long Polling for development
    connectDB().then(() => connectAgenda().then(() => bot.start()));
  }
}

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
startServer();
export default app;
