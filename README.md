# 宝宝成长记录(本地部署版本)
原项目地址: [mybaby](https://github.com/zhajiahe/my-baby)

基于 Next.js 的宝宝成长记录应用，支持 Docker Compose 一键部署。

## 功能

- 多宝宝管理与切换
- 成长记录追踪（身高、体重、头围）
- 随心记（里程碑、日记）
- 媒体相册（照片/视频，支持 HEIC）
- 成长曲线图表

## 一键部署

```bash
# 克隆项目
git clone https://github.com/zhajiahe/mybaby-local.git
cd mybaby-local

# 启动服务
docker compose up -d
```

访问 http://localhost:3000 开始使用。

## 自定义配置

### 远程访问配置

默认配置适用于本地访问。如需远程访问，修改 `docker-compose.yml`：

```yaml
app:
  environment:
    # 改为服务器 IP 或域名
    - MINIO_EXTERNAL_ENDPOINT=http://你的服务器IP:9500
    - MINIO_PUBLIC_URL=http://你的服务器IP:9500/my-baby
```

### 内网模式（推荐）

当前版本默认启用内网模式：
- 媒体文件通过应用代理访问（`/api/media/`）
- MinIO 无需对外暴露，更安全
- 无需配置外部地址

### 端口配置

| 服务 | 默认端口 | 说明 |
|------|---------|------|
| 应用 | 3000 | 主应用 |
| MinIO API | 9500 | 存储 API |
| MinIO Console | 9501 | 存储管理界面 |

修改端口：编辑 `docker-compose.yml` 中的 `ports` 配置。

### 数据持久化

数据存储在 Docker volumes 中：
- `sqlite-data`: 数据库
- `minio-data`: 媒体文件

备份数据：
```bash
docker compose cp app:/app/data ./backup-data
docker compose cp minio:/data ./backup-minio
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动 MinIO
docker compose up -d minio minio-init

# 配置环境
cp env.example .env

# 初始化数据库
pnpm run db:push

# 启动开发
pnpm run dev
```

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- SQLite + Prisma
- MinIO（S3 兼容存储）

## License

MIT
