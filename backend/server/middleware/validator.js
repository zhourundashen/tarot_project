/**
 * 数据验证中间件
 * @description 请求数据验证
 */

const ResponseUtil = require('../utils/response');

const validator = {
    /**
     * 验证必填字段
     * @param {...string} fields - 字段名列表
     */
    requireFields: (...fields) => {
        return (req, res, next) => {
            const missingFields = [];
            
            for (const field of fields) {
                const value = req.body[field];
                if (value === undefined || value === null || value === '') {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                return res.status(400).json(
                    ResponseUtil.error(
                        `缺少必填字段: ${missingFields.join(', ')}`,
                        400
                    )
                );
            }

            next();
        };
    },

    /**
     * 验证手机号格式
     */
    validatePhone: (req, res, next) => {
        const { phone } = req.body;
        
        if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
            return res.status(400).json(
                ResponseUtil.error('手机号格式不正确', 400)
            );
        }

        next();
    },

    /**
     * 验证密码长度
     * @param {number} min - 最小长度
     * @param {number} max - 最大长度
     */
    validatePassword: (min = 6, max = 20) => {
        return (req, res, next) => {
            const { password } = req.body;
            
            if (password && (password.length < min || password.length > max)) {
                return res.status(400).json(
                    ResponseUtil.error(`密码长度必须在${min}-${max}位之间`, 400)
                );
            }

            next();
        };
    },

    /**
     * 验证分页参数
     */
    validatePagination: (req, res, next) => {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 20;

        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        if (limit > 100) limit = 100;

        req.query.page = page;
        req.query.limit = limit;

        next();
    },

    /**
     * 自定义验证函数
     * @param {Function} validateFn - 验证函数
     */
    custom: (validateFn) => {
        return async (req, res, next) => {
            try {
                await validateFn(req, res, next);
                next();
            } catch (error) {
                return res.status(400).json(
                    ResponseUtil.error(error.message, 400)
                );
            }
        };
    }
};

module.exports = validator;
