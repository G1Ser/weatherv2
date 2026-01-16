# 天气预报项目

基于百度地图 API 的天气预报应用，支持城市搜索、天气查询、收藏夹和生活建议功能。

## 项目技术栈

## 项目规范

### 代码风格

- 使用分号结束语句
- 缩进使用 2 个空格
- 每行最大字符数为 120
- Vue 文件中的 script 和 style 标签不额外缩进
- 使用单引号（JSX 中使用双引号）
- 箭头函数单参数时省略括号

### 提交规范

使用 Conventional Commits 规范，类型包括：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

### 项目结构

```

```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev              # 启动开发服务器
```

### 构建

```bash
pnpm build            # 生产构建
pnpm build:analyze    # 构建并分析包大小
pnpm build:profile    # 构建并分析性能
pnpm build:gzip       # 构建并启用 gzip 压缩
pnpm preview          # 预览生产构建
```

### 代码质量

```bash
pnpm lint             # 运行 ESLint 检查
pnpm lint:fix         # 自动修复 ESLint 问题
pnpm format           # 格式化代码
pnpm format:check     # 检查代码格式
pnpm type-check       # TypeScript 类型检查
```

### 单元测试

```bash

```
