# 天气预报项目

基于 Angular + TypeScript 的百度地图API的天气预报应用。

## 项目特点

- **地理数据库**
  基于IP定位结合自建地理数据库，提升城市识别的稳定性与可控性，减少对单一第三方服务的依赖

- **PostGIS空间能力支持**
  使用PostGIS扩展地理空间查询能力，实现更准确的区域匹配

- **跨端体验设计**
  同一套业务在桌面端与移动端提供差异化交互

- **接口缓存与性能优化**
  通过 Cloudflare 构建缓存层，减少百度API调用

- **AI协同开发实践**
  在需求拆解、代码实现、重构与规范治理中引入AI协同

## 项目介绍

- 城市搜索
- 当前天气展示
- 24 小时预报
- 7 日预报
- 气象详情指标
- 空气质量
- 生活指数
- 收藏城市
- 明暗主题切换

## 技术栈

- Angular（Standalone + Signal）
- TypeScript
- SCSS
- Angular CLI

## 项目规范

### 代码风格

- 使用 TypeScript 严格类型约束，避免 `any` 滥用
- 统一 ESLint + Prettier 规则，保证代码风格一致
- 组件职责单一：容器组件负责状态与数据流，展示组件负责 UI 渲染
- 样式采用 SCSS 分层组织，公共变量与主题 Token 集中维护
- 命名语义化（组件、方法、状态、类型）
- 新增功能优先考虑可复用性与可测试性

### 提交规范

采用 Conventional Commits：

- `feat`: 新功能
- `fix`: 缺陷修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响逻辑）
- `refactor`: 重构（不新增功能/不修复缺陷）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 工具链、构建、依赖维护

## 项目结构

```
src/
├─ app/
│  ├─ components/      # 通用业务组件
│  ├─ core/            # 核心能力
│  ├─ utils/           # 工具方法
│  ├─ types/           # 业务类型定义
│  └─ ...
├─ api/                # 接口封装与请求模型
├─ environments/       # 环境配置
├─ assets/             # 静态资源（字体、图片等）
├─ lib/                # 本地可复用库
└─ styles/             # 全局样式与主题变量
```

## 快速开始

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev           # 启动开发服务器
pnpm build         # 生产构建
pnpm preview       # 本地预览构建产物
pnpm lint          # ESLint 检查
pnpm lint:fix      # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm format:check  # Prettier 检查
pnpm type-check    # TypeScript 类型检查
```
