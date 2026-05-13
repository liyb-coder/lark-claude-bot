import { startBot, stopBot } from "./bot";

async function main() {
  await startBot();

  const shutdown = async () => {
    console.log("\n[bot] shutting down...");
    await stopBot();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[bot] failed to start:", err);
  process.exit(1);
});
