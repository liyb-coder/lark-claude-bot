import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";

const client = new Anthropic({
  apiKey: config.anthropicApiKey,
  ...(config.anthropicBaseURL ? { baseURL: config.anthropicBaseURL } : {}),
});

type ChatHistory = Anthropic.MessageParam[];
const sessions = new Map<string, ChatHistory>();

const MAX_HISTORY = 20;

function getHistory(chatId: string): ChatHistory {
  if (!sessions.has(chatId)) sessions.set(chatId, []);
  return sessions.get(chatId)!;
}

export async function chat(
  chatId: string,
  userMessage: string
): Promise<string> {
  const history = getHistory(chatId);

  history.push({ role: "user", content: userMessage });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  const res = await client.messages.create({
    model: config.claudeModel,
    max_tokens: 2048,
    system: "You are a helpful assistant integrated into Lark (Feishu). Keep responses concise and clear. Use Chinese if the user writes in Chinese.",
    messages: history,
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  history.push({ role: "assistant", content: text });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  return text;
}

export function clearHistory(chatId: string): void {
  sessions.delete(chatId);
}

export const systemPrompt =
  "You are a helpful assistant integrated into Lark (Feishu). Keep responses concise and clear. Use Chinese if the user writes in Chinese.";
