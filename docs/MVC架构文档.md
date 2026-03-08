# MVC架构文档

## 📋 目录
- [架构概述](#架构概述)
- [目录结构](#目录结构)
- [各层职责](#各层职责)
- [数据流转](#数据流转)
- [开发规范](#开发规范)
- [示例说明](#示例说明)

---

## 架构概述

本项目采用标准的 **MVC (Model-View-Controller)** 架构模式，实现了前后端分离和业务逻辑分层。

### 架构优势
- **关注点分离**: 数据、业务逻辑、路由清晰分层
- **可维护性强**: 修改一层不影响其他层
- **可测试性高**: 每层可独立测试
- **团队协作友好**: 不同成员可并行开发不同层
- **代码复用**: 工具类和中间件可跨模块使用

---

## 目录结构

```
backend/server/
├── config/                  # 配置层
│   └── database.js         # 数据库配置
│
├── models/                  # M - 数据模型层
│   ├── UserModel.js        # 用户模型
│   ├── SignModel.js        # 签到模型
│   ├── CreditsModel.js     # 积分模型
│   └── ReadingModel.js     # 占卜记录模型
│
├── controllers/             # C - 控制器层
│   ├── AuthController.js   # 认证控制器
│   ├── UserController.js   # 用户控制器
│   ├── CreditsController.js# 积分控制器
│   ├── ReadingController.js# 占卜控制器
│   └── AIController.js     # AI控制器
│
├── routes/                  # 路由层
│   ├── auth.js             # 认证路由
│   ├── user.js             # 用户路由
│   ├── credits.js          # 积分路由
│   ├── reading.js          # 占卜路由
│   └── ai.js               # AI路由
│
├── middleware/              # 中间件层
│   ├── authMiddleware.js   # JWT认证中间件
│   ├── errorHandler.js     # 错误处理中间件
│   └── validator.js        # 数据验证中间件
│
├── utils/                   # 工具层
│   ├── constants.js        # 常量定义
│   ├── response.js         # 统一响应格式
│   └── jwt.js              # JWT工具函数
│
├── server.js               # 应用入口
└── swagger.js              # API文档配置

frontend/                    # V - 视图层
├── index.html
├── css/
├── js/
└── assets/
```

---

## 各层职责

### 1. **Models层 (数据模型层)**

**职责**: 负责数据访问和数据库操作

**特点**:
- 封装所有数据库操作
- 提供清晰的数据接口
- 不包含业务逻辑
- 可被多个Controller复用

**示例**:
```javascript
// models/UserModel.js
class UserModel {
    static async findById(userId) {
        return await db.getOne('SELECT * FROM users WHERE id = ?', [userId]);
    }
    
    static async create(userData) {
        // 创建用户逻辑
    }
}
```

### 2. **Controllers层 (控制器层)**

**职责**: 处理业务逻辑，协调Model和Response

**特点**:
- 包含核心业务逻辑
- 调用Model获取数据
- 调用ResponseUtil返回结果
- 不直接操作数据库

**示例**:
```javascript
// controllers/AuthController.js
class AuthController {
    static async register(req, res) {
        // 1. 验证参数
        // 2. 调用Model检查用户是否存在
        // 3. 调用Model创建用户
        // 4. 返回响应
    }
}
```

### 3. **Routes层 (路由层)**

**职责**: 定义API路由，映射到Controller

**特点**:
- 只负责路由定义
- 调用Controller处理请求
- 应用中间件
- 保持简洁，不包含业务逻辑

**示例**:
```javascript
// routes/auth.js
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
```

### 4. **Middleware层 (中间件层)**

**职责**: 请求预处理和后处理

**中间件类型**:
- `authMiddleware`: JWT认证
- `validator`: 数据验证
- `errorHandler`: 错误处理

**示例**:
```javascript
// 使用认证中间件
router.get('/profile', authMiddleware.required, UserController.getProfile);
```

### 5. **Utils层 (工具层)**

**职责**: 提供通用工具函数

**工具模块**:
- `constants.js`: 全局常量
- `response.js`: 统一响应格式
- `jwt.js`: JWT生成和验证

**示例**:
```javascript
// 使用ResponseUtil
res.json(ResponseUtil.success(data, '操作成功'));
res.status(400).json(ResponseUtil.error('参数错误'));
```

---

## 数据流转

### 完整请求流程

```
Client Request
      ↓
   Routes (路由层)
      ↓
   Middleware (中间件层)
      ├─ 认证检查
      ├─ 数据验证
      └─ 日志记录
      ↓
   Controller (控制器层)
      ├─ 业务逻辑处理
      └─ 调用Model
      ↓
   Model (数据模型层)
      └─ 数据库操作
      ↓
   Response (响应)
      ↓
Client Response
```

### 示例：用户登录流程

1. **Client** → POST `/api/auth/login`
2. **Routes** → 路由到 `AuthController.login`
3. **Controller** → 
   - 验证手机号和密码
   - 调用 `UserModel.findByPhone`
   - 调用 `UserModel.verifyPassword`
   - 生成JWT token
4. **Model** → 执行数据库查询
5. **Response** → 返回token和用户信息

---

## 开发规范

### 1. **命名规范**

- **文件名**: PascalCase (如 `UserModel.js`)
- **类名**: PascalCase (如 `UserModel`)
- **方法名**: camelCase (如 `findById`)
- **常量**: UPPER_SNAKE_CASE (如 `JWT_SECRET`)

### 2. **错误处理**

```javascript
// Controller中的错误处理
try {
    // 业务逻辑
} catch (error) {
    console.error('操作失败:', error);
    res.status(500).json(ResponseUtil.serverError('操作失败'));
}
```

### 3. **响应格式**

统一使用 `ResponseUtil`:

```javascript
// 成功响应
ResponseUtil.success(data, message)

// 错误响应
ResponseUtil.error(message, statusCode)

// 分页响应
ResponseUtil.paginated(items, total, page, limit)
```

### 4. **中间件使用**

```javascript
// 必需认证
router.get('/profile', authMiddleware.required, handler);

// 可选认证
router.get('/list', authMiddleware.optional, handler);

// 数据验证
router.post('/create', validator.requireFields('name', 'phone'), handler);
```

---

## 示例说明

### 添加新功能的步骤

假设要添加"文章管理"功能：

#### 1. 创建Model (models/ArticleModel.js)

```javascript
class ArticleModel {
    static async create(articleData) {
        // 创建文章
    }
    
    static async findById(articleId) {
        // 查找文章
    }
    
    static async getList(page, limit) {
        // 获取文章列表
    }
}
```

#### 2. 创建Controller (controllers/ArticleController.js)

```javascript
class ArticleController {
    static async create(req, res) {
        try {
            const { title, content } = req.body;
            const article = await ArticleModel.create({ title, content });
            res.json(ResponseUtil.success(article, '创建成功'));
        } catch (error) {
            res.status(500).json(ResponseUtil.serverError());
        }
    }
}
```

#### 3. 创建Route (routes/article.js)

```javascript
router.post('/create', 
    authMiddleware.required,
    validator.requireFields('title', 'content'),
    ArticleController.create
);
```

#### 4. 在server.js中注册路由

```javascript
const articleRoutes = require('./routes/article');
app.use('/api/article', articleRoutes);
```

---

## 最佳实践

### ✅ DO (推荐)

- 保持Controller简洁，复杂逻辑封装到Model
- 使用中间件处理通用逻辑（认证、验证、日志）
- 统一使用ResponseUtil返回响应
- Model方法返回Promise，便于async/await
- 使用常量代替魔法数字和字符串

### ❌ DON'T (避免)

- 在Routes中编写业务逻辑
- 在Controller中直接操作数据库
- 在Model中处理HTTP请求和响应
- 硬编码常量值
- 忽略错误处理

---

## 常见问题

### Q1: Controller和Model的区别？

**Controller**: 处理业务流程，协调各个组件
**Model**: 只负责数据操作，不关心业务逻辑

### Q2: 什么时候使用中间件？

- 需要在多个路由中重复执行的逻辑
- 请求预处理（认证、验证、日志）
- 响应后处理（错误处理、性能统计）

### Q3: 如何处理复杂业务逻辑？

1. 在Controller中协调多个Model
2. 必要时在Model中添加业务相关方法
3. 考虑使用Service层（对于特别复杂的业务）

---

## 架构演进

当前架构适用于中小型项目。随着项目规模增长，可以考虑：

1. **添加Service层**: 处理复杂业务逻辑
2. **引入Repository层**: 进一步抽象数据访问
3. **使用DI容器**: 管理依赖注入
4. **添加DTO**: 规范数据传输对象

---

## 总结

本MVC架构通过清晰的分层和职责划分，提供了：

- ✅ 高可维护性
- ✅ 高可测试性
- ✅ 高可扩展性
- ✅ 团队协作友好

遵循本文档规范，可以快速开发高质量的API接口。
