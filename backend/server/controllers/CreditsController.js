/**
 * 积分控制器
 * @description 处理积分相关业务逻辑
 */

const UserModel = require('../models/UserModel');
const SignModel = require('../models/SignModel');
const CreditsModel = require('../models/CreditsModel');
const ResponseUtil = require('../utils/response');
const CONSTANTS = require('../utils/constants');

class CreditsController {
    /**
     * 每日签到
     */
    static async sign(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('请先登录')
                );
            }

            const today = new Date().toISOString().split('T')[0];

            // 检查今日是否已签到
            const hasSigned = await SignModel.hasSignedToday(userId, today);
            if (hasSigned) {
                return res.status(400).json(
                    ResponseUtil.error('今日已签到')
                );
            }

            // 获取用户信息
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json(
                    ResponseUtil.notFound('用户不存在')
                );
            }

            // 创建签到记录
            await SignModel.createSignRecord(userId, today, CONSTANTS.CREDITS.PER_SIGN);

            // 更新用户积分
            const updatedUser = await UserModel.updateCredits(userId, CONSTANTS.CREDITS.PER_SIGN);

            // 记录积分交易
            await CreditsModel.recordSignCredits(userId, updatedUser.credits);

            res.json(ResponseUtil.success({
                creditsEarned: CONSTANTS.CREDITS.PER_SIGN,
                currentCredits: updatedUser.credits,
                totalCredits: updatedUser.total_credits
            }, '签到成功'));
        } catch (error) {
            console.error('签到失败:', error);
            res.status(500).json(
                ResponseUtil.serverError('签到失败，请稍后重试')
            );
        }
    }

    /**
     * 获取积分状态
     */
    static async getStatus(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.json(
                    ResponseUtil.success({
                        hasSignedToday: false,
                        currentCredits: 0,
                        totalCredits: 0,
                        creditsPerSign: CONSTANTS.CREDITS.PER_SIGN,
                        creditsPerReading: CONSTANTS.CREDITS.PER_READING
                    })
                );
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json(
                    ResponseUtil.notFound('用户不存在')
                );
            }

            const today = new Date().toISOString().split('T')[0];
            const hasSignedToday = await SignModel.hasSignedToday(userId, today);

            res.json(ResponseUtil.success({
                hasSignedToday,
                currentCredits: user.credits,
                totalCredits: user.total_credits,
                creditsPerSign: CONSTANTS.CREDITS.PER_SIGN,
                creditsPerReading: CONSTANTS.CREDITS.PER_READING
            }));
        } catch (error) {
            console.error('获取积分状态失败:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取积分状态失败')
            );
        }
    }

    /**
     * 获取积分历史
     */
    static async getHistory(req, res) {
        try {
            const userId = req.user?.userId;
            const { page = 1, limit = 20 } = req.query;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('请先登录')
                );
            }

            const result = await CreditsModel.getTransactionHistory(userId, page, limit);

            res.json(ResponseUtil.success(result));
        } catch (error) {
            console.error('获取积分历史失败:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取积分历史失败')
            );
        }
    }

    /**
     * 积分兑换
     */
    static async exchange(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('请先登录')
                );
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json(
                    ResponseUtil.notFound('用户不存在')
                );
            }

            // 检查积分是否足够
            if (user.credits < CONSTANTS.CREDITS.PER_READING) {
                return res.status(400).json(
                    ResponseUtil.error(
                        `积分不足，需要${CONSTANTS.CREDITS.PER_READING}积分，当前${user.credits}积分`
                    )
                );
            }

            // 扣除积分，增加占卜次数
            const updatedUser = await UserModel.updateCredits(
                userId,
                -CONSTANTS.CREDITS.PER_READING,
                1
            );

            // 记录积分交易
            await CreditsModel.recordExchangeCredits(userId, updatedUser.credits);

            res.json(ResponseUtil.success({
                creditsUsed: CONSTANTS.CREDITS.PER_READING,
                currentCredits: updatedUser.credits,
                readingCount: updatedUser.reading_count
            }, '兑换成功'));
        } catch (error) {
            console.error('兑换失败:', error);
            res.status(500).json(
                ResponseUtil.serverError('兑换失败，请稍后重试')
            );
        }
    }

    /**
     * 检查占卜权限
     */
    static async checkPermission(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.json(
                    ResponseUtil.success({
                        canRead: true,
                        needCredits: false,
                        currentCredits: 0
                    })
                );
            }

            const user = await UserModel.findById(userId);

            res.json(ResponseUtil.success({
                canRead: (user.reading_count || 0) > 0,
                needCredits: (user.reading_count || 0) === 0,
                currentCredits: user.credits,
                currentReadingCount: user.reading_count || 0,
                requiredCredits: CONSTANTS.CREDITS.PER_READING
            }));
        } catch (error) {
            console.error('检查积分失败:', error);
            res.status(500).json(
                ResponseUtil.serverError('检查积分失败')
            );
        }
    }
}

module.exports = CreditsController;
