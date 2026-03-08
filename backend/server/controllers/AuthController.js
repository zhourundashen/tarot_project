/**
 * 认证控制器
 * @description 处理用户认证相关业务逻辑
 */

const UserModel = require('../models/UserModel');
const JWTUtil = require('../utils/jwt');
const ResponseUtil = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

class AuthController {
    /**
     * 用户注册
     */
    static async register(req, res) {
        try {
            const { phone, password, nickname } = req.body;

            // 验证必填字段
            if (!phone || !password) {
                return res.status(400).json(
                    ResponseUtil.error('手机号和密码不能为空')
                );
            }

            // 检查手机号是否已注册
            const exists = await UserModel.existsByPhone(phone);
            if (exists) {
                return res.status(400).json(
                    ResponseUtil.error('该手机号已注册')
                );
            }

            // 创建用户
            const user = await UserModel.create({
                phone,
                password,
                nickname
            });

            // 生成token
            const token = JWTUtil.generateToken({
                userId: user.id,
                phone: user.phone
            });

            res.json(ResponseUtil.success({
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    nickname: user.nickname,
                    credits: user.credits
                }
            }, '注册成功'));
        } catch (error) {
            console.error('注册错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('注册失败，请稍后重试')
            );
        }
    }

    /**
     * 用户登录
     */
    static async login(req, res) {
        try {
            const { phone, password } = req.body;

            // 验证必填字段
            if (!phone || !password) {
                return res.status(400).json(
                    ResponseUtil.error('手机号和密码不能为空')
                );
            }

            // 查找用户
            const user = await UserModel.findByPhone(phone);
            if (!user) {
                return res.status(400).json(
                    ResponseUtil.error('用户不存在')
                );
            }

            // 验证密码
            const isValid = await UserModel.verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(400).json(
                    ResponseUtil.error('密码错误')
                );
            }

            // 生成token
            const token = JWTUtil.generateToken({
                userId: user.id,
                phone: user.phone
            });

            res.json(ResponseUtil.success({
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    nickname: user.nickname,
                    avatar: user.avatar,
                    vipLevel: user.vip_level,
                    credits: user.credits,
                    readingCount: user.reading_count || 0
                }
            }, '登录成功'));
        } catch (error) {
            console.error('登录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('登录失败，请稍后重试')
            );
        }
    }

    /**
     * 游客登录
     */
    static async guestLogin(req, res) {
        try {
            const guestId = `guest_${uuidv4().replace(/-/g, '')}`;
            const token = JWTUtil.generateToken({ guestId });

            res.json(ResponseUtil.success({
                token,
                isGuest: true
            }));
        } catch (error) {
            console.error('游客登录错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('游客登录失败')
            );
        }
    }

    /**
     * 获取当前用户信息
     */
    static async getCurrentUser(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.json(
                    ResponseUtil.success({ isGuest: true })
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
            console.error('获取当前用户错误:', error);
            res.status(500).json(
                ResponseUtil.serverError('获取用户信息失败')
            );
        }
    }
}

module.exports = AuthController;
