/**
 * AI路由
 * @description AI相关路由定义
 */

const express = require('express');
const router = express.Router();
const AIController = require('../controllers/AIController');

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: AI聊天
 *     tags: [AI]
 */
router.post('/chat', AIController.chat);

/**
 * @swagger
 * /api/ai/recommend-spread:
 *   post:
 *     summary: 推荐牌阵
 *     tags: [AI]
 */
router.post('/recommend-spread', AIController.recommendSpread);

module.exports = router;
