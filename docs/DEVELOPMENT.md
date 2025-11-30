# 开发与部署指南

本文档详细介绍如何在本地开发和部署宝宝成长记录应用。

## 📋 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
  - [克隆项目](#1-克隆项目)
  - [安装依赖](#2-安装依赖)
  - [环境配置](#3-环境配置)
  - [数据库设置](#4-数据库设置)
  - [启动开发服务器](#5-启动开发服务器)
- [Vercel 部署](#vercel-部署)
  - [准备工作](#准备工作)
  - [导入项目](#导入项目)
  - [配置环境变量](#配置环境变量)
  - [部署完成](#部署完成)
- [Cloudflare R2 配置](#cloudflare-r2-配置)
- [常见问题](#常见问题)

---

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

| 工具 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| Node.js | 18.0.0 | 20.x LTS | [下载地址](https://nodejs.org/) |
| npm | 9.0.0 | 10.x | 随 Node.js 一起安装 |
| Git | 2.0.0 | 最新版 | [下载地址](https://git-scm.com/) |
| FFmpeg | 4.0 | 最新版 | 视频处理（可选，用于视频封面生成） |

### 安装 FFmpeg（可选）

**macOS (使用 Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
下载 [FFmpeg 官方构建版](https://ffmpeg.org/download.html) 并添加到系统 PATH。

---

## 本地开发

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/zhajiahe/my-baby.git

# 或使用 SSH
git clone git@github.com:zhajiahe/my-baby.git

# 进入项目目录
cd my-baby
```

### 2. 安装依赖

```bash
npm install
```

安装完成后，你会看到 `node_modules` 目录被创建。

### 3. 环境配置

#### 3.1 创建环境变量文件

```bash
cp env.example .env
```

#### 3.2 配置环境变量

编辑 `.env` 文件，填入以下配置：

```env
# ==================== 数据库配置 ====================
# Neon PostgreSQL 数据库连接字符串
# 格式: postgresql://用户名:密码@主机:端口/数据库名?sslmode=require
DATABASE_URL="postgresql://username:password@ep-xxx.region.neon.tech/my-baby?sslmode=require"

# ==================== Cloudflare R2 配置 ====================
# R2 API 令牌
R2_TOKEN="your_r2_api_token"

# R2 访问密钥 ID
R2_ACCESS_KEY_ID="your_access_key_id"

# R2 访问密钥
R2_SECRET_ACCESS_KEY="your_secret_access_key"

# R2 端点 URL
R2_ENDPOINT="https://your_account_id.r2.cloudflarestorage.com"

# R2 公开访问域名（用于访问上传的文件）
R2_PUBLIC_DOMAIN="https://cdn.yourdomain.com"

# Cloudflare 账号 ID
R2_ACCOUNT_ID="your_cloudflare_account_id"

# R2 存储桶名称
R2_BUCKET_NAME="my-baby-photos"

# ==================== 可选配置 ====================
# FFmpeg 路径（如果不在系统 PATH 中）
# FFMPEG_PATH="/usr/local/bin/ffmpeg"
# FFPROBE_PATH="/usr/local/bin/ffprobe"
```

### 4. 数据库设置

#### 4.1 生成 Prisma 客户端

```bash
npm run db:generate
```

#### 4.2 同步数据库结构

```bash
npm run db:push
```

这会根据 `prisma/schema.prisma` 文件创建数据库表。

#### 4.3（可选）填充测试数据

```bash
npm run db:seed
```

#### 4.4（可选）查看数据库

```bash
npm run db:studio
```

这会打开 Prisma Studio，一个可视化的数据库管理界面。

### 5. 启动开发服务器

```bash
npm run dev
```

服务器启动后，访问 [http://localhost:3000](http://localhost:3000) 即可看到应用。

#### 开发模式特性：
- 🔄 热模块替换 (HMR)：代码修改后自动刷新
- 📝 详细错误信息：开发模式下显示完整错误堆栈
- 🔍 API 请求日志：控制台显示所有 API 请求

---

## Vercel 部署

[Vercel](https://vercel.com) 是 Next.js 的官方托管平台，提供最佳的部署体验。

### 准备工作

1. 注册 [Vercel 账号](https://vercel.com/signup)
2. 将代码推送到 GitHub/GitLab/Bitbucket
3. 准备好所有环境变量

### 导入项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 `my-baby` 仓库
5. 点击 **"Import"**

### 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | Neon 数据库连接字符串 | `postgresql://...` |
| `R2_TOKEN` | Cloudflare R2 API 令牌 | `xxx...` |
| `R2_ACCESS_KEY_ID` | R2 访问密钥 ID | `xxx...` |
| `R2_SECRET_ACCESS_KEY` | R2 访问密钥 | `xxx...` |
| `R2_ENDPOINT` | R2 端点 URL | `https://xxx.r2.cloudflarestorage.com` |
| `R2_PUBLIC_DOMAIN` | 文件公开访问域名 | `https://cdn.yourdomain.com` |
| `R2_ACCOUNT_ID` | Cloudflare 账号 ID | `xxx...` |
| `R2_BUCKET_NAME` | R2 存储桶名称 | `my-baby-photos` |

**添加方法：**
1. 进入项目 → **Settings** → **Environment Variables**
2. 逐个添加环境变量
3. 选择环境：Production / Preview / Development

### 部署完成

配置完成后，Vercel 会自动开始构建和部署：

1. **构建阶段**：运行 `npm run build`
2. **部署阶段**：将构建产物部署到 CDN
3. **完成**：获得一个 `xxx.vercel.app` 域名

#### 自定义域名

1. 进入项目 → **Settings** → **Domains**
2. 添加你的域名（如 `baby.yourdomain.com`）
3. 按照提示在你的 DNS 提供商处添加记录：
   - **CNAME**: `baby` → `cname.vercel-dns.com`
   - 或 **A 记录**: `76.76.21.21`

---

## Cloudflare R2 配置

详细的 R2 配置步骤请参考主 README.md 中的 [Cloudflare R2 配置指南](../README.md#-cloudflare-r2-配置指南)。

### 快速检查清单

- [ ] 创建 Cloudflare 账号
- [ ] 创建 R2 存储桶
- [ ] 生成 R2 API 令牌（包含 Admin Read & Write 权限）
- [ ] 获取 Access Key ID 和 Secret Access Key
- [ ] 配置存储桶的公开访问域名
- [ ] 在 CORS 设置中允许你的应用域名

### CORS 配置

在 R2 存储桶设置中添加 CORS 规则：

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-app.vercel.app",
      "https://baby.yourdomain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 常见问题

### Q: 构建时出现 Prisma 错误

**问题**: `Error: Could not find a production build in the '.next' directory`

**解决方案**:
```bash
rm -rf .next node_modules/.cache
npm run build
```

### Q: 数据库连接失败

**问题**: `Error: Connection to database failed`

**检查项**:
1. 确认 `DATABASE_URL` 格式正确
2. 确认数据库服务正常运行
3. 检查网络连接（Neon 需要网络访问）
4. 确认 SSL 模式配置（Neon 需要 `?sslmode=require`）

### Q: 文件上传失败

**问题**: 上传到 R2 时返回 403 错误

**检查项**:
1. 确认 R2 API 令牌权限正确
2. 检查 CORS 配置是否包含当前域名
3. 确认存储桶名称拼写正确
4. 检查 Access Key ID 和 Secret Access Key

### Q: 视频封面生成失败

**问题**: 视频上传成功但没有封面

**检查项**:
1. 确认 FFmpeg 已安装：`ffmpeg -version`
2. 如果 FFmpeg 不在 PATH 中，设置 `FFMPEG_PATH` 环境变量
3. 检查服务器日志中的 FFmpeg 错误信息

### Q: 暗黑模式不生效

**问题**: 切换系统暗黑模式后应用没有变化

**解决方案**: 
刷新页面，暗黑模式通过 CSS `prefers-color-scheme` 媒体查询实现，需要页面重新加载 CSS。

---

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 代码检查 |
| `npm run db:generate` | 生成 Prisma 客户端 |
| `npm run db:push` | 同步数据库结构 |
| `npm run db:studio` | 打开 Prisma Studio |
| `npm run db:seed` | 填充测试数据 |
| `npm run db:reset` | 重置数据库并填充测试数据 |

---

## 获取帮助

如果你遇到问题：

1. 查看项目 [Issues](https://github.com/zhajiahe/my-baby/issues)
2. 提交新的 Issue 描述你的问题
3. 提供以下信息有助于快速定位问题：
   - 操作系统和版本
   - Node.js 版本 (`node -v`)
   - 完整的错误信息
   - 重现步骤

