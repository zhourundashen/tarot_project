/**
 * 用户模型
 * @description 用户相关数据库操作
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../utils/constants');

class UserModel {
    /**
     * 根据ID查找用户
     * @param {string} userId - 用户ID
     * @returns {Promise<Object|null>} 用户对象或null
     */
    static async findById(userId) {
        return await db.getOne(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
    }

    /**
     * 根据手机号查找用户
     * @param {string} phone - 手机号
     * @returns {Promise<Object|null>} 用户对象或null
     */
    static async findByPhone(phone) {
        return await db.getOne(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );
    }

    /**
     * 创建新用户
     * @param {Object} userData - 用户数据
     * @returns {Promise<Object>} 创建的用户对象
     */
    static async create(userData) {
        const { phone, password, nickname } = userData;
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert('users', {
            id: userId,
            phone,
            password: hashedPassword,
            nickname: nickname || `用户${phone.slice(-4)}`,
            credits: CONSTANTS.CREDITS.INITIAL_CREDITS,
            total_credits: CONSTANTS.CREDITS.INITIAL_CREDITS,
            reading_count: 0,
            created_at: new Date()
        });

        return await this.findById(userId);
    }

    /**
     * 验证密码
     * @param {string} plainPassword - 明文密码
     * @param {string} hashedPassword - 哈希密码
     * @returns {Promise<boolean>} 验证结果
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * 更新用户信息
     * @param {string} userId - 用户ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<boolean>} 更新结果
     */
    static async update(userId, updateData) {
        const result = await db.update('users', updateData, 'id = ?', [userId]);
        return result.affectedRows > 0;
    }

    /**
     * 更新用户积分
     * @param {string} userId - 用户ID
     * @param {number} creditsChange - 积分变化（正数增加，负数减少）
     * @param {number} readingCountChange - 占卜次数变化
     * @returns {Promise<Object>} 更新后的用户信息
     */
    static async updateCredits(userId, creditsChange, readingCountChange = 0) {
        const user = await this.findById(userId);
        if (!user) return null;

        const newCredits = Math.max(0, user.credits + creditsChange);
        const newTotalCredits = creditsChange > 0 ? user.total_credits + creditsChange : user.total_credits;
        const newReadingCount = Math.max(0, (user.reading_count || 0) + readingCountChange);

        await this.update(userId, {
            credits: newCredits,
            total_credits: newTotalCredits,
            reading_count: newReadingCount
        });

        return await this.findById(userId);
    }

    /**
     * 获取用户资料（不含敏感信息）
     * @param {string} userId - 用户ID
     * @returns {Promise<Object|null>} 用户资料
     */
    static async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user) return null;

        return {
            id: user.id,
            phone: user.phone,
            nickname: user.nickname,
            avatar: user.avatar,
            vipLevel: user.vip_level,
            credits: user.credits,
            totalCredits: user.total_credits,
            readingCount: user.reading_count || 0,
            createdAt: user.created_at
        };
    }

    /**
     * 检查手机号是否已存在
     * @param {string} phone - 手机号
     * @returns {Promise<boolean>} 是否存在
     */
    static async existsByPhone(phone) {
        const user = await this.findByPhone(phone);
        return !!user;
    }
}

module.exports = UserModel;
