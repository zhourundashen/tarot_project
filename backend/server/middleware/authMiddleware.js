/**
 * JWT认证中间件
 * @description 验证JWT token并解析用户信息
 */

const JWTUtil = require('../utils/jwt');
const ResponseUtil = require('../utils/response');

const authMiddleware = {
    /**
     * 验证JWT token（必需）
     */
    required: (req, res, next) => {
        try {
            const token = JWTUtil.extractToken(req);
            
            if (!token) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('请先登录')
                );
            }

            const decoded = JWTUtil.verifyToken(token);
            
            if (!decoded) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('登录已过期，请重新登录')
                );
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error('认证中间件错误:', error);
            return res.status(401).json(
                ResponseUtil.unauthorized('认证失败')
            );
        }
    },

    /**
     * 验证JWT token（可选）
     * @description 如果提供token则验证，否则继续
     */
    optional: (req, res, next) => {
        try {
            const token = JWTUtil.extractToken(req);
            
            if (token) {
                const decoded = JWTUtil.verifyToken(token);
                if (decoded) {
                    req.user = decoded;
                }
            }
            
            next();
        } catch (error) {
            console.error('可选认证中间件错误:', error);
            next();
        }
    },

    /**
     * 检查用户角色
     * @param {...string} roles - 允许的角色列表
     */
    checkRole: (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('请先登录')
                );
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json(
                    ResponseUtil.forbidden('权限不足')
                );
            }

            next();
        };
    },

    /**
     * 从header中提取用户ID（用于简单认证）
     */
    extractUserId: (req, res, next) => {
        const userId = req.headers['x-user-id'];
        
        if (userId) {
            req.userId = userId;
        }
        
        next();
    }
};

module.exports = authMiddleware;
