# E-Commerce Frontend Shell

当前仓库已切换为**前端壳模式**：页面与交互完整保留。默认使用本地 mock；已预配置 Payload CMS 作为内容源，可通过环境变量切换。

## 技术栈

- SvelteKit 2
- Svelte 5（Runes）
- Tailwind CSS v4
- TanStack Query（仅前端态与请求生命周期管理）
- TypeScript + ESLint + Prettier

## 当前架构

### 数据来源

内容层通过 `src/lib/cms` 做 provider 分发：

- `PUBLIC_CMS_PROVIDER=mock`：全部走本地 mock
- `PUBLIC_CMS_PROVIDER=payload`：优先读取 Payload（失败自动回落 mock）

mock 数据入口为：

- `src/lib/mock/index.ts`

拆分结构如下（6 个文件）：

- `src/lib/mock/settings.ts`
- `src/lib/mock/navigation.ts`
- `src/lib/mock/catalog.ts`
- `src/lib/mock/content.ts`
- `src/lib/mock/orders.ts`
- `src/lib/mock/index.ts`

### 路由加载方式

- 页面 `+page.ts` / `+layout.ts` 通过 `$lib/cms` + `$lib/mock` 组合读取。
- `sitemap.xml` 的导航数据同样经过 cms provider 层。
- 历史的 `frontend-data.ts` 已移除。

详细说明见：

- [`docs/frontend-shell.md`](docs/frontend-shell.md)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

### 3. 启动开发

```bash
npm run dev
```

## 常用命令

- `npm run dev`：启动开发服务器
- `npm run build`：生产构建
- `npm run preview`：预览构建产物
- `npm run check`：`svelte-check` 类型与模板检查
- `npm run lint`：ESLint 检查
- `npm run lint:fix`：自动修复 lint 问题
- `npm run format`：Prettier 格式化

## 环境变量

当前主要变量：

- `PUBLIC_CMS_PROVIDER`（`mock` 或 `payload`）
- `PUBLIC_PAYLOAD_URL`（使用 payload 时必填）
- `PUBLIC_PAYLOAD_SETTINGS_GLOBAL`
- `PUBLIC_PAYLOAD_NAV_COLLECTION`
- `PUBLIC_PAYLOAD_PAGE_COLLECTION`
- `PUBLIC_PAYLOAD_SECTION_COLLECTION`
- `PUBLIC_PAYLOAD_ASSET_COLLECTION`
- `PUBLIC_MEDIA_BASE_URL`（相对图片路径的基础地址）
- `PUBLIC_R2_CDN_URL`（可选，图片 CDN 地址）
- `PUBLIC_ANALYTICS_CODE`（可选，统计脚本片段）

参考：

- [`.env.example`](.env.example)

## 文档

- [前端壳技术说明](docs/frontend-shell.md)
- [Payload 预配置说明](docs/payload-preconfig.md)
- [环境变量示例](.env.example)

## License

MIT
