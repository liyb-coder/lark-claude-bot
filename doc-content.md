# 飞书 CLI 能力介绍与使用指南

## 什么是飞书 CLI？

飞书 CLI（`lark-cli`）是飞书官方出品的命令行工具，让你可以在终端中直接操作飞书的各项能力——查日历、写文档、发消息、管任务等。它也是 AI 编程助手（如 Claude Code、Cursor、Copilot 等）操控飞书的标准通道。

---

## 能力总览

### 日历

| 命令示例 | 功能 |
|---------|------|
| `lark-cli calendar +agenda` | 查看日程列表 |
| `lark-cli calendar events instance_view --params '{"calendar_id":"primary","start_time":"...","end_time":"..."}'` | 查询时间段内事件 |
| 支持创建/更新/删除日历及事件 | |

### 消息与群聊

| 命令示例 | 功能 |
|---------|------|
| `lark-cli im +messages-send --user-id ou_xxx --text "hello"` | 发送消息给用户 |
| `lark-cli im +chat-create` | 创建群聊 |
| `lark-cli im +messages-search --chat-id oc_xxx` | 搜索聊天记录 |
| `lark-cli im +chat-messages-list --chat-id oc_xxx` | 查看消息列表 |

### 文档

| 命令示例 | 功能 |
|---------|------|
| `lark-cli docs +create --title "xxx" --markdown "..."` | 创建云文档 |
| `lark-cli docs +fetch --doc-token xxx` | 读取文档内容 |
| `lark-cli docs +update --doc-token xxx --markdown "..."` | 更新文档 |
| `lark-cli docs +search --query "关键字"` | 搜索文档 |

### 多维表格

| 命令示例 | 功能 |
|---------|------|
| `lark-cli base +records-list` | 查询记录 |
| `lark-cli base +records-create` | 新增记录 |
| `lark-cli base +records-update` | 更新记录 |

### 任务

| 命令示例 | 功能 |
|---------|------|
| `lark-cli task +list` | 查看任务列表 |
| `lark-cli task +create` | 创建任务 |
| 支持任务分配、评论、附件 | |

### 邮箱

| 命令示例 | 功能 |
|---------|------|
| `lark-cli mail +list` | 查看邮件列表 |
| `lark-cli mail +send` | 发送邮件 |

### 审批

| 命令示例 | 功能 |
|---------|------|
| `lark-cli approval +instances-list` | 查看审批实例 |
| `lark-cli approval +instances-approve` | 审批操作 |

### 其他

- **通讯录**：搜索用户、获取用户信息
- **云盘**：上传/下载文件、管理文件夹
- **视频会议**：查询会议、导出会议记录
- **OKR**：管理目标与关键结果
- **幻灯片**：创建和更新演示文稿
- **白板**：生成和更新白板
- **知识库**：搜索和管理 Wiki 内容
- **妙记**：搜索和管理会议纪要

---

## 针对你的推荐

基于你当前的工作流（VSCode + vibe coding + 飞书日常使用），建议优先使用以下能力：

### 优先级最高

1. **日历** —— `lark-cli calendar +agenda` 查看今日日程，不用切到飞书看今天的安排
2. **消息** —— 让 AI 帮你发消息通知自己或团队成员（比如编译完成、测试通过后自动通知）
3. **文档** —— 让 AI 直接创建/更新飞书文档（就像我刚刚创建这篇文档一样），减少复制粘贴

### 推荐场景

- **写日报/周报**：AI 整理当天代码提交记录，生成日报写入飞书文档
- **Bug 追踪**：发现 bug 后，AI 自动在飞书多维表格里创建一条记录
- **任务管理**：从代码 TODO 注释自动创建飞书任务，追踪进度
- **提醒推送**：长任务跑完后，AI 给你在飞书上发一条消息通知结果

### 进阶玩法

你现在已经有了 CC-cli 机器人，可以在飞书里 @它 对话。结合 lark-cli，可以实现：

```
你在飞书说 "帮我看看今天日程" → CC-cli bot → AI → lark-cli calendar +agenda → 回复你日程
```

这就是把飞书 CLI 和机器人打通，体验完整的飞书 AI 助手。

---

## 快速上手

```bash
# 查看今天日程
lark-cli calendar +agenda

# 搜索文档
lark-cli docs +search --query "设计文档"

# 给自己发一条测试消息
lark-cli im +messages-send --user-id ou_xxx --text "hello from CLI"

# 创建一篇云文档
lark-cli docs +create --title "测试" --markdown "# Hello"
```

---

*本文档由 Claude Code 通过飞书 CLI 自动创建。*
