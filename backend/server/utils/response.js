/**
 * 统一响应格式工具
 * @description 标准化API响应格式
 */

class ResponseUtil {
    /**
     * 成功响应
     * @param {Object} data - 返回的数据
     * @param {string} message - 成功消息
     * @returns {Object} 标准成功响应对象
     */
    static success(data = null, message = '操作成功') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 错误响应
     * @param {string} message - 错误消息
     * @param {number} statusCode - HTTP状态码
     * @param {Object} errors - 详细错误信息
     * @returns {Object} 标准错误响应对象
     */
    static error(message = '操作失败', statusCode = 400, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return response;
    }

    /**
     * 分页响应
     * @param {Array} items - 数据列表
     * @param {number} total - 总数量
     * @param {number} page - 当前页码
     * @param {number} limit - 每页数量
     * @returns {Object} 标准分页响应对象
     */
    static paginated(items, total, page, limit) {
        return this.success({
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }

    /**
     * 未授权响应
     * @param {string} message - 错误消息
     * @returns {Object} 未授权响应对象
     */
    static unauthorized(message = '未授权访问') {
        return this.error(message, 401);
    }

    /**
     * 禁止访问响应
     * @param {string} message - 错误消息
     * @returns {Object} 禁止访问响应对象
     */
    static forbidden(message = '禁止访问') {
        return this.error(message, 403);
    }

    /**
     * 资源未找到响应
     * @param {string} message - 错误消息
     * @returns {Object} 资源未找到响应对象
     */
    static notFound(message = '资源未找到') {
        return this.error(message, 404);
    }

    /**
     * 服务器错误响应
     * @param {string} message - 错误消息
     * @returns {Object} 服务器错误响应对象
     */
    static serverError(message = '服务器内部错误') {
        return this.error(message, 500);
    }
}

module.exports = ResponseUtil;
