# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-06

### Added
- Docker Compose 一键部署支持
- MinIO 对象存储集成（替代 Cloudflare R2）
- 统一类型系统 (`src/types/`)
- API 响应工具 (`src/lib/api-response.ts`)
- 存储服务抽象 (`src/lib/storage.ts`)

### Changed
- 数据库从 PostgreSQL 迁移到 SQLite
- 包管理器从 npm 迁移到 pnpm
- PhotoGallery 组件拆分为模块化结构
- Milestone tags 从数组类型改为 JSON 字符串（SQLite 兼容）

### Removed
- Cloudflare R2 相关代码
- @neondatabase/serverless 依赖
- 旧的 Neon PostgreSQL 配置

## [Unreleased]

### Added
- 成长记录图表增加了统计信息卡片，显示记录天数和最新记录日期
- 改进了成长记录图表的视觉效果，包括更丰富的渐变色彩和阴影效果
- 美化了图表空状态的显示样式，增加了装饰性元素

### Changed
- 重新设计了首页成长记录图表区域的布局和样式
- 优化了图表的线条、数据点和工具提示样式
- 增强了图表容器的视觉效果，使用更现代化的设计
- 改进了图表坐标轴和网格的样式表现

### Deprecated
- 

### Removed
- 删除了首页成长记录图表下方的"查看详细记录"按钮
- 删除了空状态时的"添加成长记录"按钮

### Fixed
- 

### Security
- 

## [0.1.0] - 2024-01-01

### Added
- Initial project setup with Next.js 15.3.3
- React 19.0.0 integration
- TypeScript configuration
- Tailwind CSS for styling
- ESLint configuration for code quality
- Prisma ORM integration with Neon database
- Database management scripts (generate, push, studio, seed, reset)
- Basic project structure and development environment

### Changed
- Initial release

### Fixed
- Initial release

---

## How to update this changelog

When making changes to the project, please update this changelog following these guidelines:

### Types of changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

### Guidelines
1. Add new entries to the "Unreleased" section
2. Move entries from "Unreleased" to a new version section when releasing
3. Include the release date in YYYY-MM-DD format
4. Link to GitHub releases or tags when available
5. Group similar changes together
6. Use clear, descriptive language
7. Reference issue numbers where applicable

### Example entry format
```
### Added
- New user authentication system (#123)
- Email notification feature
- Dark mode toggle in settings

### Fixed
- Fixed login button not responding on mobile devices (#456)
- Resolved database connection timeout issues 