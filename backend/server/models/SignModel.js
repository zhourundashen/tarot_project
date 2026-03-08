/**
 * 签到模型
 * @description 签到相关数据库操作
 */

const db = require('../config/database');
const CONSTANTS = require('../utils/constants');

class SignModel {
    /**
     * 检查用户今日是否已签到
     * @param {string} userId - 用户ID
     * @param {string} date - 日期字符串 (YYYY-MM-DD)
     * @returns {Promise<boolean>} 是否已签到
     */
    static async hasSignedToday(userId, date) {
        const sign = await db.getOne(
            'SELECT id FROM sign_records WHERE user_id = ? AND sign_date = ?',
            [userId, date]
        );
        return !!sign;
    }

    /**
     * 创建签到记录
     * @param {string} userId - 用户ID
     * @param {string} date - 日期字符串
     * @param {number} creditsEarned - 获得的积分
     * @returns {Promise<boolean>} 创建结果
     */
    static async createSignRecord(userId, date, creditsEarned = CONSTANTS.CREDITS.PER_SIGN) {
        const result = await db.insert('sign_records', {
            user_id: userId,
            sign_date: date,
            credits_earned: creditsEarned
        });
        return result.affectedRows > 0;
    }

    /**
     * 获取用户签到历史
     * @param {string} userId - 用户ID
     * @param {number} limit - 限制数量
     * @returns {Promise<Array>} 签到记录列表
     */
    static async getSignHistory(userId, limit = 30) {
        return await db.query(
            'SELECT * FROM sign_records WHERE user_id = ? ORDER BY sign_date DESC LIMIT ?',
            [userId, limit]
        );
    }

    /**
     * 获取用户连续签到天数
     * @param {string} userId - 用户ID
     * @returns {Promise<number>} 连续签到天数
     */
    static async getContinuousSignDays(userId) {
        const records = await db.query(
            `SELECT sign_date FROM sign_records 
             WHERE user_id = ? 
             ORDER BY sign_date DESC 
             LIMIT 365`,
            [userId]
        );

        if (records.length === 0) return 0;

        let continuousDays = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSignDate = new Date(records[0].sign_date);
        lastSignDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastSignDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) return 0;

        for (let i = 1; i < records.length; i++) {
            const current = new Date(records[i - 1].sign_date);
            const previous = new Date(records[i].sign_date);
            const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));

            if (diff === 1) {
                continuousDays++;
            } else {
                break;
            }
        }

        return continuousDays;
    }
}

module.exports = SignModel;
