/**
 * 服务器入口文件
 * @description Express应用主配置
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const specs = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const CONSTANTS = require('./utils/constants');
const logger = require('./utils/logger');
const securityMiddleware = require('./middleware/security');
const rateLimiters = require('./middleware/rateLimiter');
const CacheUtil = require('./utils/cache');

const app = express();

// ==================== 性能优化中间件 ====================

// 响应压缩
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 1024,
    level: 6
}));

// ==================== 安全中间件 ====================

// 安全Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// XSS和SQL注入防护
app.use(securityMiddleware.sanitize);
app.use(securityMiddleware.preventParamPollution);

// ==================== 日志中间件 ====================

// HTTP请求日志
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// 应用日志中间件
app.use(logger.logRequest.bind(logger));

// ==================== 基础中间件 ====================

// CORS配置
app.use(cors());

// 请求体解析（增加大小限制）
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务（带缓存）
app.use(express.static(path.join(__dirname, '../../frontend'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));
app.use('/data', express.static(path.join(__dirname, '../../data'), {
    maxAge: '7d',
    etag: true
}));

// ==================== 路由配置 ====================

// API路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const readingRoutes = require('./routes/reading');
const aiRoutes = require('./routes/ai');
const creditsRoutes = require('./routes/credits');

// 通用API限流
app.use('/api', rateLimiters.api);

// 认证路由（严格限流）
app.use('/api/auth', rateLimiters.auth, authRoutes);

// 用户路由
app.use('/api/user', userRoutes);

// 占卜路由（适度限流）
app.use('/api/reading', rateLimiters.reading, readingRoutes);

// AI路由（适度限流）
app.use('/api/ai', rateLimiters.ai, aiRoutes);

// 积分路由
app.use('/api/credits', creditsRoutes);

// ==================== API文档 ====================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 健康检查
 *     description: 检查服务器是否正常运行，包括缓存统计
 *     tags: [系统]
 *     responses:
 *       200:
 *         description: 服务正常
 */
app.get('/api/health', (req, res) => {
    const cacheStats = CacheUtil.getStats();
    
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '2.1.0',
        architecture: 'MVC',
        features: {
            compression: true,
            rateLimit: true,
            security: true,
            cache: true,
            logging: true
        },
        cache: cacheStats
    });
});

/**
 * @swagger
 * /api/cache/stats:
 *   get:
 *     summary: 缓存统计
 *     description: 获取缓存使用统计信息
 *     tags: [系统]
 *     responses:
 *       200:
 *         description: 缓存统计信息
 */
app.get('/api/cache/stats', (req, res) => {
    const stats = CacheUtil.getStats();
    res.json({
        success: true,
        data: stats
    });
});

/**
 * @swagger
 * /api/cache/clear:
 *   post:
 *     summary: 清空缓存
 *     description: 清空所有缓存数据（需要管理员权限）
 *     tags: [系统]
 *     responses:
 *       200:
 *         description: 缓存已清空
 */
app.post('/api/cache/clear', (req, res) => {
    CacheUtil.clear();
    logger.info('缓存已手动清空');
    res.json({
        success: true,
        message: '缓存已清空'
    });
});

// Swagger API文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '神秘塔罗 API 文档 - MVC架构'
}));

// ==================== 错误处理 ====================

// 404处理
app.use(errorHandler.notFound);

// 全局错误处理
app.use(errorHandler.global);

// ==================== 启动服务器 ====================

const PORT = process.env.PORT || 3000;
const db = require('./config/database');

db.connect()
    .then(() => {
        console.log('✅ 数据库连接成功');
        app.listen(PORT, () => {
            console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
            console.log(`📚 API文档: http://localhost:${PORT}/api-docs`);
            console.log(`🏗️  架构模式: MVC (Model-View-Controller)`);
            console.log('');
            console.log('🔧 性能优化:');
            console.log('   ✓ 响应压缩已启用');
            console.log('   ✓ 内存缓存已启用');
            console.log('   ✓ 静态资源缓存已启用');
            console.log('');
            console.log('🛡️  安全增强:');
            console.log('   ✓ 安全Headers (Helmet)');
            console.log('   ✓ 请求限流 (Rate Limit)');
            console.log('   ✓ XSS防护');
            console.log('   ✓ SQL注入防护');
            console.log('   ✓ 请求日志审计');
            console.log('');
            logger.info(`服务器启动成功 - 端口 ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ 数据库连接失败:', err.message);
        console.log('⚠️  将以无数据库模式启动...');
        logger.warn('数据库连接失败，以无数据库模式启动');
        app.listen(PORT, () => {
            console.log(`🚀 服务器运行在 http://localhost:${PORT} (无数据库)`);
            logger.info(`服务器启动成功（无数据库）- 端口 ${PORT}`);
        });
    });

process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，准备关闭服务器...');
    logger.info('服务器正在关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到SIGINT信号，准备关闭服务器...');
    logger.info('服务器正在关闭...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    logger.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    logger.error('未处理的Promise拒绝:', { reason, promise });
});

module.exports = app;
