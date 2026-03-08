/**
 * 安全中间件
 * @description 提供XSS防护、SQL注入防护等安全功能
 */

const xss = require('xss');
const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

const securityMiddleware = {
    xssSanitize(data) {
        if (typeof data === 'string') {
            return xss(data, {
                whiteList: {},
                stripIgnoreTag: true,
                stripIgnoreTagBody: ['script', 'style']
            });
        }
        
        if (Array.isArray(data)) {
            return data.map(item => this.xssSanitize(item));
        }
        
        if (data && typeof data === 'object') {
            const sanitized = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    sanitized[key] = this.xssSanitize(data[key]);
                }
            }
            return sanitized;
        }
        
        return data;
    },

    sqlInjectionPatterns: [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b)/gi,
        /(--)|(\/\*)|(\*\/)/g,
        /(\b(OR|AND)\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/gi,
        /(\b(OR|AND)\b\s+['"][^'"]*['"]?\s*=\s*['"][^'"]*['"]?)/gi,
        /(;|\||`|\\)/g,
        /(EXEC|EXECUTE|XP_|SP_)/gi
    ],

    detectSQLInjection(value) {
        if (typeof value !== 'string') {
            return false;
        }

        for (const pattern of this.sqlInjectionPatterns) {
            if (pattern.test(value)) {
                return true;
            }
        }

        return false;
    },

    checkSQLInjection(data) {
        if (typeof data === 'string') {
            return this.detectSQLInjection(data);
        }
        
        if (Array.isArray(data)) {
            return data.some(item => this.checkSQLInjection(item));
        }
        
        if (data && typeof data === 'object') {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (this.checkSQLInjection(data[key])) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    },

    sanitize(req, res, next) {
        try {
            if (req.body && Object.keys(req.body).length > 0) {
                if (securityMiddleware.checkSQLInjection(req.body)) {
                    logger.logSecurity('SQL注入尝试', {
                        ip: req.ip,
                        url: req.originalUrl,
                        body: req.body
                    });
                    return res.status(400).json(
                        ResponseUtil.error('检测到非法输入', 400)
                    );
                }
                req.body = securityMiddleware.xssSanitize(req.body);
            }

            if (req.query && Object.keys(req.query).length > 0) {
                if (securityMiddleware.checkSQLInjection(req.query)) {
                    logger.logSecurity('SQL注入尝试', {
                        ip: req.ip,
                        url: req.originalUrl,
                        query: req.query
                    });
                    return res.status(400).json(
                        ResponseUtil.error('检测到非法输入', 400)
                    );
                }
                req.query = securityMiddleware.xssSanitize(req.query);
            }

            if (req.params && Object.keys(req.params).length > 0) {
                if (securityMiddleware.checkSQLInjection(req.params)) {
                    logger.logSecurity('SQL注入尝试', {
                        ip: req.ip,
                        url: req.originalUrl,
                        params: req.params
                    });
                    return res.status(400).json(
                        ResponseUtil.error('检测到非法输入', 400)
                    );
                }
                req.params = securityMiddleware.xssSanitize(req.params);
            }

            next();
        } catch (error) {
            logger.error('安全中间件错误:', error);
            return res.status(500).json(
                ResponseUtil.error('安全验证失败', 500)
            );
        }
    },

    preventParamPollution(req, res, next) {
        for (const key in req.query) {
            if (Array.isArray(req.query[key])) {
                req.query[key] = req.query[key][0];
            }
        }
        next();
    },

    noCache(req, res, next) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
        next();
    }
};

module.exports = securityMiddleware;
