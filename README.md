# 神秘塔罗项目

一个基于AI的智能塔罗占卜平台。

## 📁 项目结构

```
tarot_project/
├── frontend/              # 前端项目
│   ├── index.html        # 主页面
│   ├── 404.html          # 404错误页面
│   ├── 500.html          # 500错误页面
│   ├── css/              # 样式文件
│   ├── js/               # JavaScript文件
│   └── assets/           # 静态资源（图片、字体等）
│
├── backend/              # 后端项目
│   ├── server/           # Express服务器
│   │   ├── server.js    # 服务器入口文件
│   │   ├── config/      # 配置文件
│   │   ├── routes/      # API路由
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── middleware/  # 中间件
│   │   └── utils/       # 工具函数
│   └── scripts/         # 后端脚本（Python等）
│
├── data/                 # 数据文件
│   └── knowledge/       # 塔罗知识库
│       ├── index.json   # 知识库索引
│       └── books/       # 知识库书籍数据
│
├── docs/                 # 文档
│   ├── 工作日志/        # 开发日志
│   ├── 已归档报告/      # 历史报告
│   └── *.md             # 项目文档
│
├── resources/            # 资源文件
│   └── tarot_books/     # 塔罗书籍PDF
│
└── skills/               # AI技能配置

```

## 🚀 快速开始

### 启动后端服务器

```bash
cd backend/server
npm install
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 访问前端

启动后端服务器后，直接访问 `http://localhost:3000` 即可。

## 🏗️ 架构模式

本项目采用标准的 **MVC (Model-View-Controller)** 架构模式：

### 后端架构 (MVC)
```
backend/server/
├── models/          # M - 数据模型层（数据库操作）
├── controllers/     # C - 控制器层（业务逻辑）
├── routes/          # 路由层（API端点定义）
├── middleware/      # 中间件层（认证、验证、错误处理）
├── utils/           # 工具层（常量、响应格式、JWT）
└── config/          # 配置层（数据库配置）
```

### 前端架构 (View)
```
frontend/
├── index.html       # 主视图
├── css/            # 样式
├── js/             # 控制器逻辑
└── assets/         # 静态资源
```

📖 详细说明请查看 [MVC架构文档](docs/MVC架构文档.md)

## 🛠️ 技术栈

### 前端
- HTML5 / CSS3 / JavaScript (ES6+)
- 无框架，原生实现
- 响应式设计

### 后端
- Node.js + Express
- **MVC架构模式**
- MySQL 数据库
- JWT 认证
- Swagger API 文档
- 统一响应格式
- 中间件层（认证、验证、错误处理）

## 📚 API 文档

启动服务器后，访问 `http://localhost:3000/api-docs` 查看完整的API文档。

## 🔧 开发指南

### 前端开发
- 前端文件位于 `frontend/` 目录
- CSS文件在 `frontend/css/`
- JavaScript文件在 `frontend/js/`
- 静态资源在 `frontend/assets/`

### 后端开发
- 后端代码位于 `backend/server/`
- API路由在 `backend/server/routes/`
- 数据库配置在 `backend/server/config/database.js`

### 数据管理
- 塔罗知识库在 `data/knowledge/`
- 通过 `data/knowledge/index.json` 索引所有知识库文件

## 🌟 功能特性

- ✨ **22种专业牌阵**：从单牌阵到关系牌阵，满足不同占卜需求
- 🎴 **78张塔罗牌**：完整的韦特塔罗牌系统，每张牌都有深度解读
- 🤖 **AI智能解读**：基于智谱GLM-5的AI占卜师，提供专业解读
- 📊 **智能知识库**：按需加载塔罗知识，提升解读深度
- 🎨 **精美分享**：4种风格的分享图片，支持保存和分享
- 📱 **移动端适配**：完美适配手机和平板
- 👤 **用户系统**：用户注册、登录、积分系统
- 📅 **每日签到**：签到获取积分，解锁更多功能

## ⚙️ 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- 现代浏览器（Chrome, Firefox, Safari, Edge）

## 🔐 配置说明

### 智谱AI API配置
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并创建应用
3. 获取API密钥
4. 在 `backend/server/.env` 文件中配置 `ZHIPU_API_KEY`

### 数据库配置
1. 创建MySQL数据库：`CREATE DATABASE tarot_db;`
2. 在 `.env` 文件中配置数据库连接信息

## 📝 更新日志

### v2.3.1 (2026-03-07) - 智能知识库系统 🚀
- ✅ 智能知识库按需加载系统
- ✅ AI迁移至智谱GLM-5
- ✅ 性能优化60%（响应时间从8-12秒降到3-5秒）
- ✅ 分享功能完整修复
- ✅ 总结功能深度优化（字数增加800%）
- ✅ 移动端全面适配

### v2.2.0 (2026-03-06) - AI功能增强
- ✅ AI流式输出实现
- ✅ 性能优化与安全增强
- ✅ 分享图片可视化图表

### v2.0.0 (2026-03-05) - MVC架构重构 🎉
- ✅ 重构为标准MVC架构模式
- ✅ 创建Models层（UserModel、SignModel、CreditsModel、ReadingModel）
- ✅ 创建Controllers层（AuthController、UserController、CreditsController、ReadingController、AIController）
- ✅ 创建Middleware层（认证、验证、错误处理）
- ✅ 创建Utils层（常量、响应格式、JWT工具）
- ✅ 简化Routes层，只负责路由定义
- ✅ 更新server.js入口文件
- ✅ 创建MVC架构文档
- ✅ 所有代码通过语法验证
- ✅ 目录结构重组

## 📄 许可证

本项目仅供学习和娱乐使用。

## 👥 联系方式

如有问题或建议，请联系：support@tarot.com
