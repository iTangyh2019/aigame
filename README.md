# AI 游戏平台

这是一个集合HTML5游戏的平台项目，使用Python爬虫收集游戏数据，并通过Next.js构建web界面展示。

## 项目结构

- `games.json`: 包含游戏数据的JSON文件
- `html5games_crawler.py`: 用于爬取HTML5游戏数据的Python脚本
- `tap4-ai-webui/`: Web前端子模块，基于Next.js构建

## 功能特点

- 使用Python爬虫自动收集HTML5游戏信息
- 支持游戏分类、搜索和筛选
- 响应式设计，适配各种设备
- 国际化支持

## 运行说明

### 爬虫部分

```bash
python html5games_crawler.py
```

### Web前端

进入tap4-ai-webui目录，然后:

```bash
cd tap4-ai-webui
pnpm install
pnpm dev
```

## 数据格式

游戏数据存储在games.json文件中，每个游戏包含以下字段:

- title: 游戏标题
- description: 游戏描述
- cover_image: 游戏封面图片URL
- game_url: 游戏链接
- tags: 游戏标签 