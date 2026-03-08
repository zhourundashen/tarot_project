/**
 * 占卜记录模型
 * @description 占卜记录相关数据库操作
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ReadingModel {
    /**
     * 创建占卜记录
     * @param {Object} readingData - 占卜数据
     * @returns {Promise<string>} 记录ID
     */
    static async create(readingData) {
        const recordId = uuidv4();

        await db.insert('reading_records', {
            id: recordId,
            user_id: readingData.userId,
            spread_id: readingData.spreadId,
            question: readingData.question || '',
            cards: JSON.stringify(readingData.cards),
            interpretation: readingData.interpretation || null,
            created_at: new Date()
        });

        return recordId;
    }

    /**
     * 根据ID查找占卜记录
     * @param {string} recordId - 记录ID
     * @returns {Promise<Object|null>} 占卜记录
     */
    static async findById(recordId) {
        const record = await db.getOne(
            'SELECT * FROM reading_records WHERE id = ?',
            [recordId]
        );

        if (record && record.cards) {
            record.cards = JSON.parse(record.cards);
        }

        return record;
    }

    /**
     * 获取用户占卜记录列表
     * @param {string} userId - 用户ID
     * @param {number} page - 页码
     * @param {number} limit - 每页数量
     * @returns {Promise<Object>} 占卜记录列表和分页信息
     */
    static async getUserReadings(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const records = await db.query(
            `SELECT * FROM reading_records 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
            [userId]
        );

        const totalResult = await db.getOne(
            'SELECT COUNT(*) as total FROM reading_records WHERE user_id = ?',
            [userId]
        );

        const parsedRecords = records.map(record => {
            if (record.cards) {
                record.cards = JSON.parse(record.cards);
            }
            return record;
        });

        return {
            records: parsedRecords,
            pagination: {
                page,
                limit,
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / limit)
            }
        };
    }

    /**
     * 更新占卜记录
     * @param {string} recordId - 记录ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<boolean>} 更新结果
     */
    static async update(recordId, updateData) {
        const result = await db.update('reading_records', updateData, 'id = ?', [recordId]);
        return result.affectedRows > 0;
    }

    /**
     * 删除占卜记录
     * @param {string} recordId - 记录ID
     * @param {string} userId - 用户ID（用于验证权限）
     * @returns {Promise<boolean>} 删除结果
     */
    static async delete(recordId, userId) {
        const result = await db.delete(
            'reading_records',
            'id = ? AND user_id = ?',
            [recordId, userId]
        );
        return result.affectedRows > 0;
    }

    /**
     * 获取用户占卜统计
     * @param {string} userId - 用户ID
     * @returns {Promise<Object>} 统计信息
     */
    static async getUserStats(userId) {
        const stats = await db.getOne(
            `SELECT 
                COUNT(*) as total_readings,
                MAX(created_at) as last_reading_time
             FROM reading_records 
             WHERE user_id = ?`,
            [userId]
        );

        return stats || { total_readings: 0, last_reading_time: null };
    }
}

module.exports = ReadingModel;
