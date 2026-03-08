/**
 * 积分模型
 * @description 积分交易相关数据库操作
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../utils/constants');

class CreditsModel {
    /**
     * 创建积分交易记录
     * @param {Object} transactionData - 交易数据
     * @returns {Promise<string>} 交易ID
     */
    static async createTransaction(transactionData) {
        const transactionId = transactionData.id || uuidv4();
        
        await db.insert('credit_transactions', {
            id: transactionId,
            user_id: transactionData.userId,
            type: transactionData.type,
            amount: transactionData.amount,
            balance_after: transactionData.balanceAfter,
            description: transactionData.description,
            related_id: transactionData.relatedId || null,
            created_at: new Date()
        });

        return transactionId;
    }

    /**
     * 获取用户积分交易历史
     * @param {string} userId - 用户ID
     * @param {number} page - 页码
     * @param {number} limit - 每页数量
     * @returns {Promise<Object>} 交易记录和分页信息
     */
    static async getTransactionHistory(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const transactions = await db.query(
            `SELECT * FROM credit_transactions 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
            [userId]
        );

        const totalResult = await db.getOne(
            'SELECT COUNT(*) as total FROM credit_transactions WHERE user_id = ?',
            [userId]
        );

        return {
            transactions,
            pagination: {
                page,
                limit,
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / limit)
            }
        };
    }

    /**
     * 记录签到积分
     * @param {string} userId - 用户ID
     * @param {number} balanceAfter - 交易后余额
     * @returns {Promise<string>} 交易ID
     */
    static async recordSignCredits(userId, balanceAfter) {
        return await this.createTransaction({
            userId,
            type: CONSTANTS.TRANSACTION_TYPES.SIGN,
            amount: CONSTANTS.CREDITS.PER_SIGN,
            balanceAfter,
            description: '每日签到'
        });
    }

    /**
     * 记录积分兑换
     * @param {string} userId - 用户ID
     * @param {number} balanceAfter - 交易后余额
     * @returns {Promise<string>} 交易ID
     */
    static async recordExchangeCredits(userId, balanceAfter) {
        return await this.createTransaction({
            userId,
            type: CONSTANTS.TRANSACTION_TYPES.EXCHANGE,
            amount: -CONSTANTS.CREDITS.PER_READING,
            balanceAfter,
            description: '兑换占卜机会'
        });
    }

    /**
     * 记录占卜消费
     * @param {string} userId - 用户ID
     * @param {number} balanceAfter - 交易后余额
     * @param {string} readingId - 占卜记录ID
     * @returns {Promise<string>} 交易ID
     */
    static async recordConsumeCredits(userId, balanceAfter, readingId) {
        return await this.createTransaction({
            userId,
            type: CONSTANTS.TRANSACTION_TYPES.CONSUME,
            amount: 0,
            balanceAfter,
            description: '占卜消费（消耗1次）',
            relatedId: readingId
        });
    }
}

module.exports = CreditsModel;
