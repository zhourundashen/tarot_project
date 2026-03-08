/**
 * 请求限流配置
 * @description 防止DDoS攻击和恶意请求
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const createRateLimiter = (options = {}) => {
    const defaultOptions = {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
            success: false,
            message: '请求过于频繁，请稍后再试',
            code: 429
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger.logSecurity('请求限流触发', {
                ip: req.ip,
                url: req.originalUrl,
                method: req.method
            });
            res.status(429).json(options.message || defaultOptions.message);
        },
        skip: (req) => {
            return process.env.NODE_ENV === 'test';
        }
    };

    return rateLimit({ ...defaultOptions, ...options });
};

const rateLimiters = {
    general: createRateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: {
            success: false,
            message: '请求过于频繁，请稍后再试（通用限制）',
            code: 429
        }
    }),

    api: createRateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
            success: false,
            message: 'API请求过于频繁，请稍后再试',
            code: 429
        }
    }),

    auth: createRateLimiter({
        windowMs: 60 * 60 * 1000,
        max: 5,
        message: {
            success: false,
            message: '登录尝试次数过多，请1小时后再试',
            code: 429
        },
        skipSuccessfulRequests: true
    }),

    reading: createRateLimiter({
        windowMs: 60 * 60 * 1000,
        max: 30,
        message: {
            success: false,
            message: '占卜次数已达上限，请稍后再试',
            code: 429
        }
    }),

    ai: createRateLimiter({
        windowMs: 60 * 60 * 1000,
        max: 20,
        message: {
            success: false,
            message: 'AI咨询次数已达上限，请稍后再试',
            code: 429
        }
    }),

    strict: createRateLimiter({
        windowMs: 60 * 60 * 1000,
        max: 10,
        message: {
            success: false,
            message: '操作过于频繁，请稍后再试',
            code: 429
        }
    })
};

module.exports = rateLimiters;
