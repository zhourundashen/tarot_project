/**
 * 占卜路由
 * @description 占卜记录相关路由定义
 */

const express = require('express');
const router = express.Router();
const ReadingController = require('../controllers/ReadingController');
const authMiddleware = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');

/**
 * @swagger
 * /api/reading/create:
 *   post:
 *     summary: 创建占卜记录
 *     tags: [占卜]
 */
router.post('/create', 
    authMiddleware.optional, 
    ReadingController.create
);

/**
 * @swagger
 * /api/reading/list:
 *   get:
 *     summary: 获取占卜记录列表
 *     tags: [占卜]
 */
router.get('/list', 
    authMiddleware.optional,
    validator.validatePagination,
    ReadingController.getList
);

/**
 * @swagger
 * /api/reading/:id:
 *   get:
 *     summary: 获取单条占卜记录
 *     tags: [占卜]
 */
router.get('/:id', 
    authMiddleware.optional, 
    ReadingController.getById
);

/**
 * @swagger
 * /api/reading/:id:
 *   put:
 *     summary: 更新占卜记录
 *     tags: [占卜]
 */
router.put('/:id', 
    authMiddleware.optional, 
    ReadingController.update
);

/**
 * @swagger
 * /api/reading/:id:
 *   delete:
 *     summary: 删除占卜记录
 *     tags: [占卜]
 */
router.delete('/:id', 
    authMiddleware.optional, 
    ReadingController.delete
);

module.exports = router;
