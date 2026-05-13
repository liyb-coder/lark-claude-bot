import { LarkChannel } from "@larksuiteoapi/node-sdk";
import { config } from "./config";
import { chat } from "./claude";

const channel = new LarkChannel({
  appId: config.larkAppId,
  appSecret: config.larkAppSecret,
  transport: "websocket",
  policy: {
    requireMention: true,
    dmMode: "open",
  },
  loggerLevel: "info" as any,
});

channel.on("message", async (msg) => {
  try {
    console.log(`[msg] ${msg.senderName || msg.senderId}: ${msg.content}`);

    const reply = await chat(msg.chatId, msg.content);

    await channel.send(msg.chatId, { text: reply });
    console.log(`[reply] sent to ${msg.chatId}`);
  } catch (err) {
    console.error("[bot] error handling message:", err);
    try {
      await channel.send(msg.chatId, {
        text: "抱歉，处理消息时出错了，请稍后重试。",
      });
    } catch (_) {}
  }
});

channel.on("error", (err) => {
  console.error("[bot] channel error:", err.message);
});

channel.on("reconnecting", () => {
  console.log("[bot] reconnecting...");
});

channel.on("reconnected", () => {
  console.log("[bot] reconnected");
});

export async function startBot(): Promise<void> {
  console.log("[bot] connecting via WebSocket...");
  await channel.connect();
  console.log("[bot] connected and ready");
}

export async function stopBot(): Promise<void> {
  await channel.disconnect();
}
