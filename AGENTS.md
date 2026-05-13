# DevOps 自动化配置

本项目已配置完整的 **GitHub + Supabase + Vercel** 自动化流水线，适用于任何新项目快速初始化。

## 已连接的账号

| 平台 | 状态 | 账号 |
|------|------|------|
| GitHub | ✅ 已认证 | `liyb-coder` |
| Supabase | ✅ 已认证 | `liyubei` (2 projects) |
| Vercel | ✅ 已认证 | `liyubei1212-8110` |

Token 存储在 `.env` 中（已加入 `.gitignore`，不会提交）。

## 一键初始化新项目

在任何项目目录下运行：

```bash
npm run setup
# 或
node scripts/init-devops.js [project-name]
```

该命令会自动完成：

1. **GitHub**
   - `git init`（如需要）
   - `gh repo create` 创建公开仓库
   - 推送代码到 main 分支

2. **Supabase**
   - 自动推断组织 ID
   - 创建新项目（如不存在）
   - 生成数据库密码并保存到 `.env`

3. **Vercel**
   - `vercel deploy` 自动部署
   - 首次部署后会返回生产域名

## 单独操作

```bash
# 仅创建 GitHub 仓库并推送
npm run repo:create

# 仅部署到 Vercel
npm run deploy
```

## 环境变量

```bash
# 已配置在 .env 中
SUPABASE_ACCESS_TOKEN=sbp_xxx
VERCEL_TOKEN=vcp_xxx
```

如需在新项目中复用，复制 `.env` 中的 token 到新项目即可。
