/**
 * 积分路由
 * @description 积分相关路由定义
 */

const express = require('express');
const router = express.Router();
const CreditsController = require('../controllers/CreditsController');
const authMiddleware = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');

/**
 * @swagger
 * /api/credits/sign:
 *   post:
 *     summary: 每日签到
 *     tags: [积分]
 */
router.post('/sign', authMiddleware.required, CreditsController.sign);

/**
 * @swagger
 * /api/credits/status:
 *   get:
 *     summary: 获取积分状态
 *     tags: [积分]
 */
router.get('/status', authMiddleware.required, CreditsController.getStatus);

/**
 * @swagger
 * /api/credits/history:
 *   get:
 *     summary: 获取积分历史
 *     tags: [积分]
 */
router.get('/history', 
    authMiddleware.required, 
    validator.validatePagination, 
    CreditsController.getHistory
);

/**
 * @swagger
 * /api/credits/exchange:
 *   post:
 *     summary: 积分兑换
 *     tags: [积分]
 */
router.post('/exchange', authMiddleware.required, CreditsController.exchange);

/**
 * @swagger
 * /api/credits/check:
 *   get:
 *     summary: 检查占卜权限
 *     tags: [积分]
 */
router.get('/check', authMiddleware.required, CreditsController.checkPermission);

module.exports = router;
