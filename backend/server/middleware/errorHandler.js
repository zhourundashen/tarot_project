/**
 * 错误处理中间件
 * @description 统一错误处理
 */

const path = require('path');
const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

const errorHandler = {
    /**
     * 404未找到处理
     */
    notFound: (req, res, next) => {
        const error = new Error(`路由未找到 - ${req.originalUrl}`);
        error.status = 404;
        next(error);
    },

    /**
     * 全局错误处理
     */
    global: (err, req, res, next) => {
        console.error('服务器错误:', err);
        logger.error('服务器错误:', {
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip
        });

        const statusCode = err.status || err.statusCode || 500;
        const message = err.message || '服务器内部错误';

        if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
            return res.status(statusCode).json(
                ResponseUtil.error(message, statusCode, {
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
                })
            );
        }

        res.status(statusCode);
        
        if (statusCode === 404) {
            res.sendFile(path.join(__dirname, '../../frontend/404.html'));
        } else {
            res.sendFile(path.join(__dirname, '../../frontend/500.html'));
        }
    },

    /**
     * 异步错误包装器
     * @param {Function} fn - 异步函数
     */
    asyncHandler: (fn) => {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
};

module.exports = errorHandler;
