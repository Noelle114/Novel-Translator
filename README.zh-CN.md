# Novel Translator

本地优先的 Electron 桌面应用，用于翻译 EPUB / PDF 小说。

[English](./README.md) | 中文

## 快速开始

```bash
pnpm install
pnpm dev
```

## 功能特性

- 导入 EPUB / PDF 文档
- 支持 OpenAI、Gemini、DeepL、DeepSeek 翻译
- 可选目标语言（中文 / 英语 / 土耳其语），源语言自动识别
- 上下文感知翻译模式
- 全局与项目级术语表，支持 CSV 导入
- 开始 / 暂停 / 继续 / 停止运行控制，并发翻译 + 重试与退避
- 段落编辑器（合并、拆分、编辑译文）
- 一键批准全部译文
- 导出 EPUB / PDF
- 界面本地化（中文 / 英语 / 土耳其语）

## 架构

pnpm monorepo：

| 包 | 用途 |
| --- | --- |
| `apps/desktop` | Electron 主进程 / 预加载 / 渲染进程 |
| `packages/shared` | Zod schema、IPC 契约、常量 |
| `packages/domain` | 翻译状态机、术语表、错误归一化 |
| `packages/adapters` | Provider 适配器（OpenAI/Gemini/DeepL/DeepSeek）与导出器（EPUB/PDF） |
| `packages/storage` | SQLite 持久化 |
