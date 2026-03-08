/**
 * 用户控制器
 * @description 处理用户信息相关业务逻辑
 */

const UserModel = require('../models/UserModel');
const ResponseUtil = require('../utils/response');

class UserController {
    /**
     * 获取用户资料
     */
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const user = await UserModel.getProfile(userId);
            if (!user) {
                return res.status(404).json(
                    ResponseUtil.notFound('用户不存在')
                );
            }

            res.json(ResponseUtil.success(user));
        } catch (error) {
            console.error('获取用户信息错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取用户信息失败')
            );
        }
    }

    /**
     * 更新用户资料
     */
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.userId || req.headers['x-user-id'];
            const { nickname, avatar } = req.body;

            if (!userId) {
                return res.status(401).json(
                    ResponseUtil.unauthorized('未登录')
                );
            }

            const updateData = {};
            if (nickname) updateData.nickname = nickname;
            if (avatar) updateData.avatar = avatar;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json(
                    ResponseUtil.error('没有要更新的内容')
                );
            }

            const success = await UserModel.update(userId, updateData);
            if (!success) {
                return res.status(500).json(
                    ResponseUtil.serverError('更新失败')
                );
            }

            res.json(ResponseUtil.success(null, '更新成功'));
        } catch (error) {
            console.error('更新用户信息错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('更新失败')
            );
        }
    }
}

module.exports = UserController;
