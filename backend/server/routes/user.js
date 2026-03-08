/**
 * 用户路由
 * @description 用户信息相关路由定义
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: 获取用户资料
 *     tags: [用户]
 */
router.get('/profile', authMiddleware.optional, UserController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: 更新用户资料
 *     tags: [用户]
 */
router.put('/profile', authMiddleware.optional, UserController.updateProfile);

module.exports = router;
