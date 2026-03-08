#!/bin/bash

# 塔罗项目服务器环境检查脚本
# 用途：检查Ubuntu服务器是否已安装必要软件

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║     塔罗项目 - 服务器环境检查工具 v1.0       ║"
echo "║     Tarot Project - Server Environment Check  ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
TOTAL=0
INSTALLED=0
MISSING=0

# 检查函数
check_software() {
    local name=$1
    local command=$2
    local version_command=$3
    
    TOTAL=$((TOTAL + 1))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "检查 $name ..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if command -v $command &> /dev/null; then
        echo -e "${GREEN}✅ 已安装${NC}"
        if [ ! -z "$version_command" ]; then
            echo "版本信息:"
            eval $version_command 2>&1 | head -n 1
        fi
        INSTALLED=$((INSTALLED + 1))
    else
        echo -e "${RED}❌ 未安装${NC}"
        MISSING=$((MISSING + 1))
    fi
    echo ""
}

# 检查服务状态
check_service() {
    local name=$1
    local service=$2
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "检查 $name 服务状态 ..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if systemctl is-active --quiet $service 2>/dev/null; then
        echo -e "${GREEN}✅ 运行中${NC}"
        systemctl status $service 2>/dev/null | grep "Active:" | head -n 1
    else
        echo -e "${RED}❌ 未运行${NC}"
    fi
    echo ""
}

# 检查端口
check_port() {
    local port=$1
    local service=$2
    
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        echo -e "${GREEN}✅ 端口 $port ($service) - 已监听${NC}"
    else
        echo -e "${YELLOW}⚠️  端口 $port ($service) - 未监听${NC}"
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 系统信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "操作系统:"
lsb_release -a 2>/dev/null || cat /etc/os-release | grep "PRETTY_NAME"
echo "内核版本:"
uname -r
echo "主机名:"
hostname
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 基础软件检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_software "Node.js" "node" "node --version"
check_software "NPM" "npm" "npm --version"
check_software "MySQL" "mysql" "mysql --version"
check_software "Nginx" "nginx" "nginx -v"
check_software "PM2" "pm2" "pm2 --version"
check_software "Git" "git" "git --version"
check_software "Curl" "curl" "curl --version"
check_software "Wget" "wget" "wget --version"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. 服务状态检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_service "MySQL" "mysql"
check_service "Nginx" "nginx"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. 端口监听检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v netstat &> /dev/null; then
    check_port 80 "HTTP"
    check_port 443 "HTTPS"
    check_port 3000 "Node.js"
    check_port 3306 "MySQL"
else
    echo -e "${YELLOW}⚠️  netstat 未安装，跳过端口检查${NC}"
    echo "提示：运行 'sudo apt install net-tools' 安装 netstat"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. 防火墙状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v ufw &> /dev/null; then
    sudo ufw status
else
    echo -e "${YELLOW}⚠️  UFW 未安装${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. 磁盘空间检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

df -h / | awk 'NR==1 || /^\// {print}'
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. 内存使用情况"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

free -h
echo ""

echo "╔════════════════════════════════════════════════╗"
echo "║              检查结果汇总                      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "总检查项: $TOTAL"
echo -e "已安装: ${GREEN}$INSTALLED${NC}"
echo -e "未安装: ${RED}$MISSING${NC}"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}🎉 恭喜！所有必需软件都已安装！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. 准备项目文件"
    echo "2. 配置Nginx"
    echo "3. 配置SSL证书"
    echo "4. 启动应用"
else
    echo -e "${YELLOW}⚠️  还有 $MISSING 个软件需要安装${NC}"
    echo ""
    echo "缺少的软件，请运行以下命令安装："
    
    if ! command -v node &> /dev/null; then
        echo ""
        echo "# 安装 Node.js 20.x"
        echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
        echo "sudo apt install -y nodejs"
    fi
    
    if ! command -v mysql &> /dev/null; then
        echo ""
        echo "# 安装 MySQL"
        echo "sudo apt install -y mysql-server"
        echo "sudo mysql_secure_installation"
    fi
    
    if ! command -v nginx &> /dev/null; then
        echo ""
        echo "# 安装 Nginx"
        echo "sudo apt install -y nginx"
    fi
    
    if ! command -v pm2 &> /dev/null; then
        echo ""
        echo "# 安装 PM2"
        echo "sudo npm install -g pm2"
    fi
    
    if ! command -v netstat &> /dev/null; then
        echo ""
        echo "# 安装 net-tools（可选）"
        echo "sudo apt install -y net-tools"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "检查完成时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
