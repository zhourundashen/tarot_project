# 塔罗占卜后端服务

## 快速开始

### 1. 配置环境变量

编辑 `.env` 文件，修改数据库密码：

```
DB_PASSWORD=你的MySQL密码
```

### 2. 初始化数据库

```bash
# 方式1：使用npm脚本
npm run init-db

# 方式2：手动执行
mysql -u root -p < database.sql
```

### 3. 启动服务

```bash
# 生产模式
npm start

# 开发模式（需要安装nodemon）
npm run dev
```

## API接口

### 认证相关

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/auth/register | POST | 注册 |
| /api/auth/login | POST | 登录 |
| /api/auth/guest | POST | 游客登录 |

### 用户相关

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/user/profile | GET | 获取用户信息 |
| /api/user/profile | PUT | 更新用户信息 |

### 占卜相关

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/reading/create | POST | 创建占卜记录 |
| /api/reading/list | GET | 获取历史记录 |
| /api/reading/:id | GET | 获取占卜详情 |

### AI相关

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/ai/chat | POST | AI对话 |
| /api/ai/recommend-spread | POST | 推荐牌阵 |

## 目录结构

```
server/
├── server.js          # 入口文件
├── config/
│   └── database.js    # 数据库配置
├── routes/
│   ├── auth.js        # 认证路由
│   ├── user.js        # 用户路由
│   ├── reading.js     # 占卜路由
│   └── ai.js          # AI路由
├── middleware/        # 中间件（待添加）
├── models/            # 数据模型（待添加）
├── utils/             # 工具函数（待添加）
├── database.sql       # 数据库初始化
├── .env               # 环境变量
└── package.json
```
