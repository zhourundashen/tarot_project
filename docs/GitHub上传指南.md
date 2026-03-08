# GitHub上传指南

## 📋 准备工作清单

### ✅ 已完成的准备工作
- [x] 创建 `.gitignore` 文件（排除敏感文件）
- [x] 创建 `.env.example` 文件（环境变量示例）
- [x] 更新 `README.md`（项目说明文档）

### 🔴 需要你完成的步骤

---

## 第一步：安装Git（必做）

### Windows系统安装Git

**方法1：官网下载（推荐）**
1. 访问Git官网：https://git-scm.com/download/win
2. 点击"Click here to download"下载安装程序
3. 运行下载的 `.exe` 文件
4. 安装时全部选择默认选项即可
5. 安装完成后，**重启命令行窗口**

**方法2：使用winget（Windows 11自带）**
```powershell
# 以管理员身份运行PowerShell
winget install --id Git.Git -e --source winget
```

**验证安装**
```bash
# 安装完成后，重新打开命令行窗口，执行：
git --version
# 如果显示版本号，说明安装成功
```

---

## 第二步：注册GitHub账号（如果没有）

1. 访问 https://github.com/
2. 点击右上角 "Sign up"（注册）
3. 填写用户名、邮箱、密码
4. 验证邮箱
5. 选择免费计划（Free）

---

## 第三步：在GitHub创建新仓库

1. 登录GitHub后，点击右上角的 "+" 号
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `tarot_project`
   - **Description**: `智能塔罗占卜平台 - 基于AI的塔罗牌解读系统`
   - **Public**（公开）或 **Private**（私有）- 建议选择Public
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要勾选** "Add .gitignore"（我们已经有了）
4. 点击 "Create repository"

---

## 第四步：配置Git用户信息

安装Git后，需要配置你的用户名和邮箱：

```bash
# 配置用户名（替换为你的GitHub用户名）
git config --global user.name "你的GitHub用户名"

# 配置邮箱（替换为你的GitHub注册邮箱）
git config --global user.email "你的邮箱@example.com"
```

**示例**：
```bash
git config --global user.name "zhangsan"
git config --global user.email "zhangsan@example.com"
```

---

## 第五步：执行上传命令

完成以上步骤后，**告诉我你已完成**，我会帮你执行以下命令：

```bash
# 1. 初始化Git仓库
git init

# 2. 添加所有文件（.gitignore会自动排除敏感文件）
git add .

# 3. 创建第一次提交
git commit -m "Initial commit: 神秘塔罗智能占卜平台"

# 4. 关联远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/tarot_project.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

---

## 📝 你需要告诉我的信息

完成步骤1-4后，请告诉我：

1. **Git是否安装成功**（执行 `git --version` 的结果）
2. **GitHub用户名**是什么（用于生成仓库地址）
3. **GitHub仓库创建好了吗**（仓库名称应该是 tarot_project）

---

## ⚠️ 重要提示

### 已排除的敏感文件
以下文件**不会**上传到GitHub（通过.gitignore排除）：
- ✅ `.env` - 包含数据库密码和API密钥
- ✅ `工作日志/` - 本地开发记录
- ✅ `node_modules/` - 依赖文件
- ✅ 数据库文件

### 已创建的安全文件
- ✅ `.env.example` - 环境变量示例文件（其他人可以参考）
- ✅ `.gitignore` - 排除敏感文件配置
- ✅ `README.md` - 项目说明文档

---

## 🆘 常见问题

### Q1: Git安装后命令不识别？
**A**: 重启命令行窗口，或者重启电脑

### Q2: 推送时需要登录？
**A**: Git会弹出登录窗口，输入GitHub用户名和密码（或Personal Access Token）

### Q3: 如何获取Personal Access Token？
**A**: 
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. 勾选 `repo` 权限
4. 生成并保存token（只显示一次）

---

## 📞 下一步

**请完成步骤1-4，然后告诉我：**
1. Git安装成功了吗？
2. 你的GitHub用户名是什么？
3. 仓库创建好了吗？

我会帮你执行剩下的命令！
