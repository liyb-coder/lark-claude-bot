import "dotenv/config";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

// Read Claude Code settings.json to inherit its Anthropic API config.
// This lets the bot share the same API key as the host Claude Code instance
// without storing a plain-text key in .env.
function loadCCSettings(): Record<string, string> {
  try {
    const raw = readFileSync(
      join(homedir(), ".claude", "settings.json"),
      "utf-8"
    );
    const settings = JSON.parse(raw);
    return settings.env || {};
  } catch {
    return {};
  }
}

const ccEnv = loadCCSettings();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),

  anthropicApiKey:
    process.env.ANTHROPIC_AUTH_TOKEN ||
    ccEnv.ANTHROPIC_AUTH_TOKEN ||
    process.env.ANTHROPIC_API_KEY ||
    "",
  anthropicBaseURL:
    process.env.ANTHROPIC_BASE_URL ||
    ccEnv.ANTHROPIC_BASE_URL ||
    undefined,
  claudeModel:
    process.env.ANTHROPIC_MODEL ||
    ccEnv.ANTHROPIC_MODEL ||
    process.env.CLAUDE_MODEL ||
    "claude-sonnet-4-6",

  larkAppId: requireEnv("LARK_APP_ID"),
  larkAppSecret: requireEnv("LARK_APP_SECRET"),
};
