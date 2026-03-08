/**
 * 常量定义
 * @description 系统全局常量配置
 */

const CONSTANTS = {
    // JWT配置
    JWT: {
        SECRET: process.env.JWT_SECRET || 'default_secret_change_in_production',
        EXPIRES_IN: '7d'
    },
    
    // 积分相关
    CREDITS: {
        PER_SIGN: 10,           // 每次签到获得的积分
        PER_READING: 20,        // 每次占卜消耗的积分
        INITIAL_CREDITS: 50,    // 新用户初始积分
        EXCHANGE_RATIO: 20      // 积分兑换比例
    },
    
    // 分页配置
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100
    },
    
    // 用户角色
    USER_ROLES: {
        GUEST: 'guest',
        USER: 'user',
        VIP: 'vip',
        ADMIN: 'admin'
    },
    
    // 积分交易类型
    TRANSACTION_TYPES: {
        SIGN: 'sign',           // 签到
        EXCHANGE: 'exchange',   // 兑换
        CONSUME: 'consume',     // 消费
        REWARD: 'reward',       // 奖励
        REFUND: 'refund'        // 退款
    },
    
    // HTTP状态码
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_ERROR: 500
    }
};

module.exports = CONSTANTS;
