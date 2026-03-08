#!/bin/bash

# 域名配置更新脚本
# 用途：将服务器配置从IP更新为域名

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║     域名配置更新脚本                          ║"
echo "║     Domain Configuration Update               ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

DOMAIN="6789067.xyz"
SERVER_IP="119.29.233.29"

echo "域名：$DOMAIN"
echo "服务器IP：$SERVER_IP"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤1: 更新前端配置文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 更新 config.js
sudo sed -i "s|backendUrl:.*|backendUrl: 'http://$DOMAIN',|g" /var/www/tarot/frontend/js/config.js
echo -e "${GREEN}✅ config.js 已更新${NC}"

# 更新 user.js
sudo sed -i "s|backendUrl:.*|backendUrl: 'http://$DOMAIN',|g" /var/www/tarot/frontend/js/user.js
echo -e "${GREEN}✅ user.js 已更新${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤2: 更新Nginx配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 创建新的Nginx配置
sudo tee /etc/nginx/sites-available/tarot > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    access_log /var/log/nginx/tarot_access.log;
    error_log /var/log/nginx/tarot_error.log;
    
    # 前端静态文件
    location / {
        root /var/www/tarot/frontend;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API反向代理
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

# IP访问（兼容）
server {
    listen 80;
    server_name $SERVER_IP;
    
    location / {
        root /var/www/tarot/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

echo -e "${GREEN}✅ Nginx配置已更新${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤3: 测试并重启Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 测试配置
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx配置测试通过${NC}"
    
    # 重启Nginx
    sudo systemctl restart nginx
    echo -e "${GREEN}✅ Nginx已重启${NC}"
else
    echo -e "${YELLOW}❌ Nginx配置有错误${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤4: 验证配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查前端配置
echo "前端配置："
grep backendUrl /var/www/tarot/frontend/js/config.js
grep backendUrl /var/www/tarot/frontend/js/user.js

echo ""
echo "Nginx配置："
sudo nginx -T 2>/dev/null | grep "server_name" | head -5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤5: 测试访问"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "测试域名访问..."
if curl -s http://$DOMAIN | grep -q "神秘塔罗"; then
    echo -e "${GREEN}✅ 域名访问正常${NC}"
else
    echo -e "${YELLOW}⚠️  域名可能还未解析完成${NC}"
fi

echo ""
echo "测试API..."
if curl -s http://$DOMAIN/api/auth/guest -X POST -H "Content-Type: application/json" | grep -q "success"; then
    echo -e "${GREEN}✅ API正常${NC}"
else
    echo -e "${YELLOW}⚠️  API可能需要检查${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║              配置更新完成！                   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "访问地址："
echo "  域名：http://$DOMAIN"
echo "  IP：  http://$SERVER_IP"
echo ""
echo "管理员账号："
echo "  手机号：18129858819"
echo "  密码：  LYXlyx664486628~"
echo ""
echo "下一步："
echo "  1. 确认域名DNS已解析到 $SERVER_IP"
echo "  2. 在手机浏览器访问 http://$DOMAIN"
echo "  3. 测试登录和占卜功能"
echo "  4. 确认正常后申请SSL证书"
echo ""
