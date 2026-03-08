-- 塔罗占卜数据库初始化脚本

CREATE DATABASE IF NOT EXISTS tarot_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tarot_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255),
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    credits INT DEFAULT 50 COMMENT '当前积分（新用户50积分）',
    total_credits INT DEFAULT 50 COMMENT '累计获得积分',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 占卜记录表
CREATE TABLE IF NOT EXISTS reading_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    spread_id VARCHAR(50) NOT NULL,
    question TEXT,
    cards JSON NOT NULL COMMENT '牌面数据',
    interpretation TEXT COMMENT 'AI解读',
    conversation_history JSON COMMENT '追问对话历史',
    credits_used INT DEFAULT 20 COMMENT '消耗积分',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 签到记录表
CREATE TABLE IF NOT EXISTS sign_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    sign_date DATE NOT NULL COMMENT '签到日期',
    credits_earned INT DEFAULT 10 COMMENT '获得积分',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_date (user_id, sign_date),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    product_type VARCHAR(20) NOT NULL COMMENT 'vip_month/vip_year/credits',
    amount DECIMAL(10,2) NOT NULL,
    status TINYINT DEFAULT 0 COMMENT '0-待支付 1-已支付 2-已退款',
    payment_method VARCHAR(20),
    payment_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 积分流水表
CREATE TABLE IF NOT EXISTS credit_transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    type VARCHAR(20) NOT NULL COMMENT 'sign/consume/gift/exchange',
    amount INT NOT NULL COMMENT '正数增加，负数减少',
    balance_after INT NOT NULL COMMENT '操作后余额',
    description VARCHAR(255),
    related_id VARCHAR(64) COMMENT '关联ID（占卜记录ID等）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试数据
-- INSERT INTO users (id, phone, password, nickname, credits) VALUES 
-- ('test-user-001', '13800138000', '$2a$10$...', '测试用户', 10);
