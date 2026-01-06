# 开发指南

## 环境要求

| 工具 | 版本 |
|------|------|
| Node.js | 20.x |
| pnpm | 10.x |
| Docker | 20.x+ |

## 本地开发

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动 MinIO

```bash
docker compose up -d minio minio-init
```

等待 MinIO 初始化完成后，访问 http://localhost:9501 确认服务正常（账号: minioadmin / minioadmin）。

### 3. 配置环境

```bash
cp env.example .env
```

### 4. 初始化数据库

```bash
pnpm run db:generate
pnpm run db:push

# 可选：填充示例数据
pnpm run db:seed
```

### 5. 启动开发服务器

```bash
pnpm run dev
```

访问 http://localhost:3000

## Docker 部署

### 一键启动

```bash
docker compose up -d
```

### 查看日志

```bash
docker compose logs -f app
```

### 停止服务

```bash
docker compose down
```

### 清理数据

```bash
docker compose down -v  # 删除数据卷
```

## 数据库管理

```bash
# 打开 Prisma Studio
pnpm run db:studio

# 重置数据库
pnpm run db:reset
```

## 项目架构

```
src/
├── app/
│   ├── api/                 # API 路由
│   │   ├── baby/            # 宝宝信息
│   │   ├── growth-records/  # 成长记录
│   │   ├── milestones/      # 里程碑
│   │   └── photos/          # 媒体上传
│   └── components/
│       ├── photos/          # 媒体墙组件（已拆分）
│       │   ├── PhotoGrid.tsx
│       │   ├── PhotoUploader.tsx
│       │   ├── PhotoViewer.tsx
│       │   └── hooks/
│       └── ...              # 其他页面组件
├── hooks/                   # 自定义 Hooks
├── lib/
│   ├── prisma.ts            # 数据库客户端
│   ├── storage.ts           # 存储服务
│   └── api-response.ts      # API 响应工具
└── types/                   # 类型定义
```

## 常见问题

### MinIO 连接失败

确保 MinIO 服务已启动：

```bash
docker compose ps
```

### 数据库错误

重新生成 Prisma 客户端：

```bash
pnpm run db:generate
```

### 图片无法显示

检查 MinIO bucket 权限是否已设置为公开读取：

```bash
docker compose logs minio-init
```
