#!/bin/bash

# 塔罗项目一键部署脚本
# 用途：在Ubuntu服务器上快速部署塔罗项目
# 使用：bash deploy.sh

set -e  # 遇到错误立即退出

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║     塔罗项目 - 一键部署脚本 v1.0              ║"
echo "║     Tarot Project - Auto Deploy Script        ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 配置变量
SERVER_IP="119.29.233.29"
PROJECT_DIR="/var/www/tarot"
BACKEND_DIR="$PROJECT_DIR/backend/server"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 步骤计数器
STEP=0

# 打印步骤
print_step() {
    STEP=$((STEP + 1))
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}步骤 $STEP: $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 打印成功
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 打印错误
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 打印警告
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_warning "建议使用 sudo 运行此脚本"
        read -p "是否继续？(y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 步骤1: 检查环境
check_environment() {
    print_step "检查服务器环境"
    
    local missing=0
    
    # 检查Node.js
    if command -v node &> /dev/null; then
        print_success "Node.js $(node -v)"
    else
        print_error "Node.js 未安装"
        missing=$((missing + 1))
    fi
    
    # 检查NPM
    if command -v npm &> /dev/null; then
        print_success "NPM $(npm -v)"
    else
        print_error "NPM 未安装"
        missing=$((missing + 1))
    fi
    
    # 检查MySQL
    if command -v mysql &> /dev/null; then
        print_success "MySQL $(mysql --version | awk '{print $3}')"
    else
        print_error "MySQL 未安装"
        missing=$((missing + 1))
    fi
    
    # 检查Nginx
    if command -v nginx &> /dev/null; then
        print_success "Nginx $(nginx -v 2>&1 | cut -d/ -f2)"
    else
        print_error "Nginx 未安装"
        missing=$((missing + 1))
    fi
    
    # 检查PM2
    if command -v pm2 &> /dev/null; then
        print_success "PM2 $(pm2 -v)"
    else
        print_error "PM2 未安装"
        missing=$((missing + 1))
    fi
    
    if [ $missing -gt 0 ]; then
        print_error "缺少 $missing 个必需软件，请先安装"
        exit 1
    fi
    
    print_success "环境检查通过！"
}

# 步骤2: 创建项目目录
create_directories() {
    print_step "创建项目目录"
    
    print_warning "需要 sudo 权限创建目录"
    sudo mkdir -p $PROJECT_DIR
    sudo chown -R $USER:$USER $PROJECT_DIR
    
    print_success "项目目录已创建: $PROJECT_DIR"
}

# 步骤3: 复制项目文件
copy_files() {
    print_step "复制项目文件"
    
    # 检查当前目录是否有项目文件
    if [ -f "backend/server/server.js" ]; then
        print_success "检测到项目文件在当前目录"
        
        # 复制整个项目
        print_warning "复制文件中..."
        cp -r . $PROJECT_DIR/ 2>/dev/null || true
        
        print_success "项目文件已复制"
    else
        print_error "请在项目根目录运行此脚本"
        print_warning "当前目录: $(pwd)"
        print_warning "期望文件: backend/server/server.js"
        exit 1
    fi
}

# 步骤4: 配置MySQL数据库
setup_database() {
    print_step "配置MySQL数据库"
    
    print_warning "需要MySQL root密码"
    
    # 检查数据库是否存在
    if mysql -u root -p -e "USE tarot_db" 2>/dev/null; then
        print_success "数据库 tarot_db 已存在"
    else
        print_warning "创建数据库..."
        
        # 创建数据库
        mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS tarot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'tarot_user'@'localhost' IDENTIFIED BY 'LYXlyx664486628~';
GRANT ALL PRIVILEGES ON tarot_db.* TO 'tarot_user'@'localhost';
FLUSH PRIVILEGES;
EOF
        
        print_success "数据库创建成功"
    fi
    
    # 导入数据库结构（如果有）
    if [ -f "$BACKEND_DIR/database.sql" ]; then
        print_warning "导入数据库结构..."
        mysql -u tarot_user -p'LYXlyx664486628~' tarot_db < $BACKEND_DIR/database.sql
        print_success "数据库结构已导入"
    fi
}

# 步骤5: 安装后端依赖
install_dependencies() {
    print_step "安装后端依赖"
    
    cd $BACKEND_DIR
    
    if [ -f "package.json" ]; then
        print_warning "安装Node.js依赖（可能需要几分钟）..."
        npm install --production
        
        print_success "后端依赖安装完成"
    else
        print_error "未找到 package.json"
        exit 1
    fi
    
    cd $PROJECT_DIR
}

# 步骤6: 配置环境变量
setup_env() {
    print_step "配置环境变量"
    
    cd $BACKEND_DIR
    
    if [ -f ".env" ]; then
        print_success ".env 文件已存在"
    else
        print_warning "创建 .env 文件..."
        
        cat > .env <<EOF
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=tarot_user
DB_PASSWORD=LYXlyx664486628~
DB_NAME=tarot_db

# JWT配置
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

# AI配置
ZHIPU_API_KEY=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
ZHIPU_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
ZHIPU_MODEL=glm-4
EOF
        
        print_success ".env 文件已创建"
    fi
    
    cd $PROJECT_DIR
}

# 步骤7: 配置PM2
setup_pm2() {
    print_step "配置PM2"
    
    cd $BACKEND_DIR
    
    # 停止旧的进程（如果有）
    pm2 stop tarot-server 2>/dev/null || true
    pm2 delete tarot-server 2>/dev/null || true
    
    # 启动应用
    pm2 start server.js --name tarot-server
    
    # 保存PM2配置
    pm2 save
    
    # 设置开机自启
    pm2 startup systemd
    
    print_success "PM2配置完成"
    
    cd $PROJECT_DIR
}

# 步骤8: 配置Nginx
setup_nginx() {
    print_step "配置Nginx"
    
    local nginx_conf="/etc/nginx/sites-available/tarot"
    
    print_warning "需要 sudo 权限配置Nginx"
    
    # 创建Nginx配置
    sudo tee $nginx_conf > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_IP;
    
    # 日志
    access_log /var/log/nginx/tarot_access.log;
    error_log /var/log/nginx/tarot_error.log;
    
    # 前端静态文件
    location / {
        root $PROJECT_DIR/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
EOF
    
    # 启用站点
    sudo ln -sf $nginx_conf /etc/nginx/sites-enabled/tarot
    
    # 删除默认站点（可选）
    # sudo rm -f /etc/nginx/sites-enabled/default
    
    # 测试Nginx配置
    print_warning "测试Nginx配置..."
    sudo nginx -t
    
    # 重启Nginx
    print_warning "重启Nginx..."
    sudo systemctl restart nginx
    
    print_success "Nginx配置完成"
}

# 步骤9: 配置防火墙
setup_firewall() {
    print_step "配置防火墙"
    
    print_warning "需要 sudo 权限配置防火墙"
    
    # 检查UFW是否安装
    if command -v ufw &> /dev/null; then
        # 允许必要端口
        sudo ufw allow OpenSSH
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        
        print_warning "启用防火墙..."
        sudo ufw --force enable
        
        print_success "防火墙配置完成"
        sudo ufw status
    else
        print_warning "UFW 未安装，跳过防火墙配置"
    fi
}

# 步骤10: 验证部署
verify_deployment() {
    print_step "验证部署"
    
    echo "检查服务状态..."
    echo ""
    
    # 检查PM2
    pm2 list
    
    # 检查Nginx
    sudo systemctl status nginx --no-pager | grep "Active:"
    
    # 检查API
    echo ""
    print_warning "测试API连接..."
    if curl -s http://localhost:3000/api/auth/guest -X POST -H "Content-Type: application/json" | grep -q "success"; then
        print_success "API 正常响应"
    else
        print_warning "API 可能未正常启动"
    fi
    
    # 测试外部访问
    echo ""
    print_warning "测试外部访问..."
    if curl -s http://$SERVER_IP | grep -q "神秘塔罗"; then
        print_success "外部访问正常"
    else
        print_warning "外部访问可能需要检查防火墙或Nginx配置"
    fi
}

# 打印部署信息
print_deployment_info() {
    echo ""
    echo "╔════════════════════════════════════════════════╗"
    echo "║              部署成功！                       ║"
    echo "╚════════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}访问地址：${NC}"
    echo -e "  前端页面：http://$SERVER_IP"
    echo -e "  API文档： http://$SERVER_IP/api-docs"
    echo ""
    echo -e "${GREEN}管理员账号：${NC}"
    echo -e "  手机号：18129858819"
    echo -e "  密码：  LYXlyx664486628~"
    echo ""
    echo -e "${YELLOW}常用命令：${NC}"
    echo -e "  查看日志：   pm2 logs tarot-server"
    echo -e "  重启服务：   pm2 restart tarot-server"
    echo -e "  停止服务：   pm2 stop tarot-server"
    echo -e "  查看状态：   pm2 status"
    echo -e "  Nginx日志：  sudo tail -f /var/log/nginx/tarot_access.log"
    echo ""
    echo -e "${BLUE}下一步：${NC}"
    echo -e "  1. 在手机浏览器访问 http://$SERVER_IP"
    echo -e "  2. 测试登录、占卜等功能"
    echo -e "  3. 确认DNS解析后，配置SSL证书"
    echo ""
}

# 主函数
main() {
    check_root
    
    print_step "开始部署塔罗项目"
    
    check_environment
    create_directories
    copy_files
    setup_database
    install_dependencies
    setup_env
    setup_pm2
    setup_nginx
    setup_firewall
    verify_deployment
    
    print_deployment_info
}

# 执行主函数
main
