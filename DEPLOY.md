# 塔罗项目快速部署指南

**服务器IP**: 119.29.233.29  
**访问地址**: http://119.29.233.29  
**管理员账号**: 18129858819 / LYXlyx664486628~

---

## 📋 部署方式

### 方式A：自动上传 + 自动部署（推荐）

#### 在Windows电脑上：

**1. 打开PowerShell或CMD**
```powershell
cd C:\Users\MAKOTO\Desktop\tarot_project
```

**2. 运行上传脚本**
```powershell
upload.bat
```

**3. 按提示操作**
- 输入服务器密码（输入时不显示）
- 等待文件上传完成

**4. SSH连接到服务器**
```bash
ssh ubuntu@119.29.233.29
```

**5. 运行部署脚本**
```bash
cd /var/www/tarot
bash deploy.sh
```

---

### 方式B：手动上传 + 手动部署

#### 步骤1：手动上传文件

**在Windows PowerShell中运行：**
```powershell
# 进入项目目录
cd C:\Users\MAKOTO\Desktop\tarot_project

# 创建服务器目录
ssh ubuntu@119.29.233.29 "sudo mkdir -p /var/www/tarot && sudo chown -R ubuntu:ubuntu /var/www/tarot"

# 上传文件（每次输入密码）
scp -r frontend ubuntu@119.29.233.29:/var/www/tarot/
scp -r backend ubuntu@119.29.233.29:/var/www/tarot/
scp -r data ubuntu@119.29.233.29:/var/www/tarot/
scp deploy.sh ubuntu@119.29.233.29:/var/www/tarot/
```

#### 步骤2：连接服务器
```bash
ssh ubuntu@119.29.233.29
```

#### 步骤3：运行部署
```bash
cd /var/www/tarot
chmod +x deploy.sh
bash deploy.sh
```

---

## 🔧 部署脚本会自动完成

```
✅ 检查服务器环境
✅ 配置MySQL数据库
✅ 安装Node.js依赖
✅ 配置环境变量
✅ 启动PM2进程
✅ 配置Nginx反向代理
✅ 配置防火墙
✅ 验证部署成功
```

---

## 📱 测试访问

### 在手机浏览器访问：
```
http://119.29.233.29
```

### 登录测试：
```
手机号：18129858819
密码：LYXlyx664486628~
```

### 功能测试清单：
```
□ 新手引导正常显示
□ 登录/注册功能正常
□ 占卜流程完整
□ AI解读正常
□ 积分系统正常
□ 历史记录正常
```

---

## 🐛 常见问题

### 问题1：上传时提示"Permission denied"
**解决**：
```bash
ssh ubuntu@119.29.233.29
sudo chown -R ubuntu:ubuntu /var/www/tarot
```

### 问题2：部署脚本报错
**解决**：
```bash
# 查看详细错误
bash -x deploy.sh

# 或分步执行
bash deploy.sh 2>&1 | tee deploy.log
```

### 问题3：无法访问网站
**检查**：
```bash
# 1. 检查PM2
pm2 status

# 2. 检查Nginx
sudo systemctl status nginx

# 3. 检查防火墙
sudo ufw status

# 4. 检查端口
sudo netstat -tlnp | grep -E ":(80|3000)"
```

### 问题4：API无法访问
**检查**：
```bash
# 测试本地API
curl http://localhost:3000/api/auth/guest -X POST -H "Content-Type: application/json"

# 查看PM2日志
pm2 logs tarot-server

# 重启服务
pm2 restart tarot-server
```

---

## 📊 服务器管理命令

### PM2相关：
```bash
pm2 status                 # 查看状态
pm2 logs tarot-server      # 查看日志
pm2 restart tarot-server   # 重启服务
pm2 stop tarot-server      # 停止服务
pm2 start tarot-server     # 启动服务
pm2 monit                  # 监控面板
```

### Nginx相关：
```bash
sudo systemctl status nginx    # 查看状态
sudo systemctl restart nginx   # 重启Nginx
sudo nginx -t                  # 测试配置
sudo tail -f /var/log/nginx/tarot_access.log  # 查看访问日志
sudo tail -f /var/log/nginx/tarot_error.log    # 查看错误日志
```

### MySQL相关：
```bash
mysql -u tarot_user -p          # 登录数据库
# 密码：LYXlyx664486628~

# 常用SQL
SHOW DATABASES;
USE tarot_db;
SHOW TABLES;
SELECT * FROM users;
```

---

## 🔄 更新代码

### 方式1：重新上传
```powershell
# 在Windows上
scp -r backend ubuntu@119.29.233.29:/var/www/tarot/
ssh ubuntu@119.29.233.29 "cd /var/www/tarot/backend/server && npm install && pm2 restart tarot-server"
```

### 方式2：在服务器上修改
```bash
ssh ubuntu@119.29.233.29
cd /var/www/tarot
# 修改文件
pm2 restart tarot-server
```

---

## 🔐 安全建议

### 1. 修改MySQL密码
```bash
mysql -u root -p
ALTER USER 'tarot_user'@'localhost' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

### 2. 修改JWT密钥
```bash
nano /var/www/tarot/backend/server/.env
# 修改 JWT_SECRET
pm2 restart tarot-server
```

### 3. 限制SSH登录
```bash
sudo nano /etc/ssh/sshd_config
# 禁用root登录
PermitRootLogin no
# 重启SSH
sudo systemctl restart ssh
```

---

## 🌐 配置域名（可选）

等DNS解析好后：

### 1. 修改Nginx配置
```bash
sudo nano /etc/nginx/sites-available/tarot
# 将 server_name 119.29.233.29; 改为 server_name your-domain.com;
sudo nginx -t
sudo systemctl restart nginx
```

### 2. 修改前端配置
```bash
nano /var/www/tarot/frontend/js/config.js
nano /var/www/tarot/frontend/js/user.js
# 将 backendUrl 改为 http://your-domain.com:3000
```

### 3. 申请SSL证书
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📞 需要帮助？

如果遇到问题，提供以下信息：

```bash
# 运行诊断
pm2 status
sudo systemctl status nginx
pm2 logs tarot-server --lines 50
sudo tail -50 /var/log/nginx/tarot_error.log
```

---

**部署完成后访问**: http://119.29.233.29

**祝部署顺利！🎉**
