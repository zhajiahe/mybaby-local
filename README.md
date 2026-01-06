# 宝宝成长记录

基于 Next.js 的宝宝成长记录应用，支持 Docker Compose 一键部署。

## 功能

- 宝宝信息管理（姓名、出生日期、性别等）
- 成长记录追踪（身高、体重、头围）
- 里程碑记录
- 媒体相册（照片/视频上传，支持 HEIC 格式）
- 成长曲线图表

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite + Prisma
- **存储**: MinIO（S3 兼容）
- **包管理**: pnpm

## 快速开始

### Docker 一键部署（推荐）

```bash
# 克隆项目
git clone https://github.com/zhajiahe/my-baby.git
cd my-baby

# 启动服务
docker compose up -d
```

访问地址：
- 应用: http://localhost:3000
- MinIO Console: http://localhost:9501（账号: minioadmin / minioadmin）

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动 MinIO（需要先启动对象存储）
docker compose up -d minio

# 配置环境变量
cp env.example .env

# 初始化数据库
pnpm run db:generate
pnpm run db:push

# 启动开发服务器
pnpm run dev
```

## 可用命令

```bash
pnpm run dev          # 启动开发服务器
pnpm run build        # 构建生产版本
pnpm run start        # 启动生产服务器
pnpm run db:generate  # 生成 Prisma 客户端
pnpm run db:push      # 同步数据库结构
pnpm run db:studio    # 打开数据库管理界面
pnpm run db:seed      # 填充初始数据
```

## 项目结构

```
├── docker-compose.yml    # Docker 编排
├── Dockerfile            # 应用镜像
├── prisma/               # 数据库模型
├── src/
│   ├── app/
│   │   ├── api/          # API 路由
│   │   └── components/   # 页面组件
│   ├── hooks/            # React Hooks
│   ├── lib/              # 工具函数
│   └── types/            # 类型定义
└── data/                 # SQLite 数据库文件
```

## 环境变量

```env
# 数据库
DATABASE_URL="file:./data/baby.db"

# MinIO 存储
MINIO_ENDPOINT="http://localhost:9500"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET_NAME="my-baby"
MINIO_PUBLIC_URL="http://localhost:9500/my-baby"
```

## License

MIT
