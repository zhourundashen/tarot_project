/**
 * 认证路由
 * @description 用户认证相关路由定义
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [认证]
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证]
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: 游客登录
 *     tags: [认证]
 */
router.post('/guest', AuthController.guestLogin);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [认证]
 */
router.get('/me', authMiddleware.optional, AuthController.getCurrentUser);

module.exports = router;
