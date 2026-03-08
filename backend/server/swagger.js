const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '神秘塔罗 API 接口文档',
            version: '1.0.0',
            description: '智能塔罗占卜平台后端API接口文档\n\n## 团队成员\n- 后端开发：刘诗莹\n- 前端开发：张梦琳\n- AI算法：卢俊熙\n- UI设计：廖城\n- 项目管理：罗宇轩',
            contact: {
                name: '神秘塔罗团队',
                email: 'contact@tarot.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: '开发服务器'
            },
            {
                url: 'https://api.tarot.com',
                description: '生产服务器'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT认证token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: '用户ID'
                        },
                        phone: {
                            type: 'string',
                            description: '手机号'
                        },
                        nickname: {
                            type: 'string',
                            description: '昵称'
                        },
                        credits: {
                            type: 'integer',
                            description: '当前积分'
                        },
                        totalCredits: {
                            type: 'integer',
                            description: '累计积分'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '注册时间'
                        }
                    }
                },
                Reading: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: '占卜记录ID'
                        },
                        spreadId: {
                            type: 'string',
                            description: '牌阵ID'
                        },
                        spreadName: {
                            type: 'string',
                            description: '牌阵名称'
                        },
                        question: {
                            type: 'string',
                            description: '用户问题'
                        },
                        cards: {
                            type: 'array',
                            description: '抽取的牌',
                            items: {
                                type: 'object'
                            }
                        },
                        interpretation: {
                            type: 'string',
                            description: 'AI解读内容'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '占卜时间'
                        }
                    }
                },
                CreditTransaction: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: '流水ID'
                        },
                        type: {
                            type: 'string',
                            enum: ['sign', 'consume', 'gift', 'exchange'],
                            description: '类型：签到/消费/赠送/兑换'
                        },
                        amount: {
                            type: 'integer',
                            description: '积分数量（正数为获得，负数为消费）'
                        },
                        balanceAfter: {
                            type: 'integer',
                            description: '操作后余额'
                        },
                        description: {
                            type: 'string',
                            description: '描述'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '时间'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: '错误信息'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            description: '成功信息'
                        },
                        data: {
                            type: 'object',
                            description: '返回数据'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: '认证',
                description: '用户注册、登录、认证相关接口'
            },
            {
                name: '用户',
                description: '用户信息管理相关接口'
            },
            {
                name: '积分',
                description: '积分签到、兑换、流水相关接口'
            },
            {
                name: '占卜',
                description: '占卜记录、AI解读相关接口'
            },
            {
                name: 'AI',
                description: 'AI对话、解读相关接口'
            }
        ]
    },
    apis: [
        './server.js',
        './routes/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
