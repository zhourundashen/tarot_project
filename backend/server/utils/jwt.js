/**
 * JWT工具函数
 * @description JWT token生成和验证
 */

const jwt = require('jwt-simple');
const CONSTANTS = require('./constants');

class JWTUtil {
    /**
     * 生成token
     * @param {Object} payload - token载荷
     * @param {string} expiresIn - 过期时间
     * @returns {string} JWT token
     */
    static generateToken(payload, expiresIn = CONSTANTS.JWT.EXPIRES_IN) {
        const tokenPayload = {
            ...payload,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this.parseExpiresIn(expiresIn)
        };
        
        return jwt.encode(tokenPayload, CONSTANTS.JWT.SECRET);
    }

    /**
     * 验证token
     * @param {string} token - JWT token
     * @returns {Object|null} 解码后的payload，失败返回null
     */
    static verifyToken(token) {
        try {
            const decoded = jwt.decode(token, CONSTANTS.JWT.SECRET);
            
            // 检查是否过期
            if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
                return null;
            }
            
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * 解析过期时间字符串
     * @param {string} expiresIn - 过期时间字符串（如 '7d', '24h'）
     * @returns {number} 秒数
     */
    static parseExpiresIn(expiresIn) {
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));
        
        const multipliers = {
            's': 1,
            'm': 60,
            'h': 3600,
            'd': 86400
        };
        
        return value * (multipliers[unit] || 1);
    }

    /**
     * 从请求头提取token
     * @param {Object} req - Express请求对象
     * @returns {string|null} token或null
     */
    static extractToken(req) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        
        return authHeader.substring(7);
    }
}

module.exports = JWTUtil;
