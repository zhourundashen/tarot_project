/**
 * 占卜控制器
 * @description 处理占卜记录相关业务逻辑
 */

const ReadingModel = require('../models/ReadingModel');
const UserModel = require('../models/UserModel');
const CreditsModel = require('../models/CreditsModel');
const ResponseUtil = require('../utils/response');
const CONSTANTS = require('../utils/constants');

class ReadingController {
    /**
     * 创建占卜记录
     */
    static async create(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'] || 'guest';
            const { spreadId, question, cards } = req.body;

            // 验证参数
            if (!spreadId || !cards || cards.length === 0) {
                return res.status(400).json(
                    ResponseUtil.error('缺少必要参数')
                );
            }

            // 非游客用户需要检查占卜次数
            if (userId !== 'guest') {
                const user = await UserModel.findById(userId);
                
                if (!user) {
                    return res.status(404).json(
                        ResponseUtil.notFound('用户不存在')
                    );
                }

                const readingCount = user.reading_count || 0;
                
                if (readingCount < 1) {
                    return res.status(400).json(
                        ResponseUtil.error('占卜次数不足，请先兑换', 400)
                    );
                }

                // 扣除占卜次数
                const updatedUser = await UserModel.updateCredits(userId, 0, -1);

                // 记录积分交易
                await CreditsModel.recordConsumeCredits(userId, updatedUser.credits, null);
            }

            // 创建占卜记录
            const recordId = await ReadingModel.create({
                userId,
                spreadId,
                question,
                cards
            });

            // 获取更新后的用户信息
            const updatedUser = userId !== 'guest' ? 
                await UserModel.findById(userId) : null;

            res.json(ResponseUtil.success({
                recordId,
                creditsUsed: 0,
                currentCredits: updatedUser?.credits || 0,
                readingCount: updatedUser?.reading_count || 0
            }));
        } catch (error) {
            console.error('创建占卜记录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('创建记录失败')
            );
        }
    }

    /**
     * 获取占卜记录列表
     */
    static async getList(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];
            const { page = 1, limit = 20 } = req.query;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const result = await ReadingModel.getUserReadings(userId, page, limit);

            res.json(ResponseUtil.success(result));
        } catch (error) {
            console.error('获取占卜记录列表错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取记录列表失败')
            );
        }
    }

    /**
     * 获取单条占卜记录
     */
    static async getById(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];
            const { id } = req.params;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const record = await ReadingModel.findById(id);
            
            if (!record) {
                return res.status(404).json(
                    ResponseUtil.notFound('记录不存在')
                );
            }

            // 验证权限
            if (record.user_id !== userId) {
                return res.status(403).json(
                    ResponseUtil.forbidden('无权访问此记录')
                );
            }

            res.json(ResponseUtil.success(record));
        } catch (error) {
            console.error('获取占卜记录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取记录失败')
            );
        }
    }

    /**
     * 更新占卜记录
     */
    static async update(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];
            const { id } = req.params;
            const updateData = req.body;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const record = await ReadingModel.findById(id);
            
            if (!record) {
                return res.status(404).json(
                    ResponseUtil.notFound('记录不存在')
                );
            }

            // 验证权限
            if (record.user_id !== userId) {
                return res.status(403).json(
                    ResponseUtil.forbidden('无权修改此记录')
                );
            }

            const success = await ReadingModel.update(id, updateData);
            
            if (!success) {
                return res.status(500).json(
                    ResponseUtil.serverError('更新失败')
                );
            }

            res.json(ResponseUtil.success(null, '更新成功'));
        } catch (error) {
            console.error('更新占卜记录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('更新失败')
            );
        }
    }

    /**
     * 删除占卜记录
     */
    static async delete(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];
            const { id } = req.params;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const success = await ReadingModel.delete(id, userId);
            
            if (!success) {
                return res.status(404).json(
                    ResponseUtil.notFound('记录不存在或无权删除')
                );
            }

            res.json(ResponseUtil.success(null, '删除成功'));
        } catch (error) {
            console.error('删除占卜记录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('删除失败')
            );
        }
    }
}

module.exports = ReadingController;
