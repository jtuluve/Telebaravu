declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      NODE_ENV?: "development" | "production";
      PORT?: number;
      MONGO_URL?:string;
      WEBHOOK_TOKEN?:string;
    }
  }
}

export {};
