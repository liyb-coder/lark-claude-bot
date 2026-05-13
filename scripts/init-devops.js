#!/usr/bin/env node
/**
 * DevOps 自动化初始化脚本
 * 一键完成: GitHub 建仓 → Supabase 建库 → Vercel 部署
 *
 * 用法:
 *   node scripts/init-devops.js [project-name]
 *
 * 环境变量（会自动读取 .env）:
 *   SUPABASE_ACCESS_TOKEN - Supabase 访问令牌
 *   VERCEL_TOKEN          - Vercel 访问令牌
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 加载 .env
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}
loadEnv();

const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

function run(cmd, opts = {}) {
  console.log(`\n▶ ${cmd}`);
  return execSync(cmd, {
    encoding: "utf-8",
    stdio: opts.silent ? "pipe" : "inherit",
    ...opts,
  });
}

function ask(question) {
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const projectName = process.argv[2] || path.basename(process.cwd());
  console.log(`\n🚀 DevOps 自动化初始化: ${projectName}\n`);

  // ── 1. Git + GitHub ──────────────────────────────
  const isGitRepo = fs.existsSync(path.join(process.cwd(), ".git"));
  if (!isGitRepo) {
    console.log("📦 初始化 Git 仓库...");
    run("git init");
    run('git add .');
    run('git commit -m "init: initial commit"');
  } else {
    console.log("✅ Git 仓库已存在");
  }

  // 检查是否已有 remote
  let hasRemote = false;
  try {
    run("git remote get-url origin", { silent: true });
    hasRemote = true;
  } catch {
    hasRemote = false;
  }

  if (!hasRemote) {
    console.log("🐙 创建 GitHub 仓库...");
    run(`gh repo create ${projectName} --public --source=. --push`);
  } else {
    console.log("✅ GitHub remote 已存在，推送代码...");
    run("git push -u origin HEAD");
  }

  // ── 2. Supabase ──────────────────────────────────
  if (SUPABASE_TOKEN) {
    console.log("\n🗄️  检查 Supabase 项目...");
    try {
      const projects = run(
        `SUPABASE_ACCESS_TOKEN="${SUPABASE_TOKEN}" npx supabase projects list`,
        { silent: true }
      );
      const exists = projects.includes(projectName);
      if (exists) {
        console.log(`✅ Supabase 项目 "${projectName}" 已存在`);
      } else {
        console.log(`⚙️  创建 Supabase 项目: ${projectName}`);
        // 从已有项目推断 org-id
        const orgMatch = projects.match(/\|\s+([a-z0-9]+)\s+\|/);
        const orgId = orgMatch ? orgMatch[1] : null;
        if (!orgId) {
          console.log("⚠️ 无法自动推断 Supabase Org ID，跳过数据库创建");
        } else {
          const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
          run(
            `SUPABASE_ACCESS_TOKEN="${SUPABASE_TOKEN}" npx supabase projects create "${projectName}" ` +
            `--org-id "${orgId}" --region ap-southeast-1 --db-password "${password}"`,
            { silent: false }
          );
          console.log(`🔑 数据库密码已生成并保存到 .env.supabase`);
          fs.appendFileSync(
            path.join(process.cwd(), ".env"),
            `\nSUPABASE_DB_PASSWORD_${projectName.toUpperCase().replace(/-/g, "_")}=${password}\n`
          );
        }
      }
    } catch (err) {
      console.log("⚠️ Supabase 操作失败:", err.message || err);
    }
  } else {
    console.log("⚠️ 未设置 SUPABASE_ACCESS_TOKEN，跳过数据库创建");
  }

  // ── 3. Vercel ────────────────────────────────────
  if (VERCEL_TOKEN) {
    console.log("\n▲ 部署到 Vercel...");
    try {
      run(`npx vercel --yes --token "${VERCEL_TOKEN}"`);
      console.log("✅ Vercel 部署完成");
    } catch (err) {
      console.log("⚠️ Vercel 部署失败:", err.message || err);
    }
  } else {
    console.log("⚠️ 未设置 VERCEL_TOKEN，跳过 Vercel 部署");
  }

  console.log("\n🎉 DevOps 初始化完成！\n");
}

main().catch((err) => {
  console.error("\n❌ 初始化失败:", err);
  process.exit(1);
});
