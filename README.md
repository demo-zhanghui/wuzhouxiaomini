# 物流管理系统 (Carrier Unified App)

一个基于 Vue 3 + Vant 4 的现代化物流管理系统，专为移动端设计。

## 🚀 项目特性

### 核心功能模块
- **工作台** - 数据概览和快速操作入口
- **运单管理** - 运单列表、详情查看、装货卸货操作
- **车辆管理** - 车辆信息管理和状态跟踪
- **船舶管理** - 船舶信息管理和调度
- **异常上报** - 异常情况记录和处理
- **个人中心** - 用户信息和设置

### 技术特性
- ⚡ **Vue 3** - 使用 Composition API
- 🎨 **Vant 4** - 移动端 UI 组件库
- 🛠️ **Vite** - 快速构建工具
- 📱 **移动端优先** - 响应式设计
- 🎯 **TypeScript** - 类型安全

## 📁 项目结构

```
src/
├── components/          # 公共组件
├── data/               # 模拟数据
├── router/             # 路由配置
├── views/              # 页面组件
│   ├── Layout.vue      # 主布局
│   ├── Workbench.vue   # 工作台
│   ├── YunDan.vue      # 运单列表
│   ├── YunDanDetail.vue # 运单详情
│   ├── LoadingDetail.vue # 装货详情
│   ├── UnloadingDetail.vue # 卸货详情
│   ├── VehicleManage.vue # 车辆管理
│   ├── ShipManage.vue  # 船舶管理
│   ├── ExceptionReport.vue # 异常上报
│   └── My.vue          # 个人中心
└── main.js             # 应用入口
```

## 🛠️ 开发环境

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📱 页面功能说明

### 1. 工作台 (Workbench.vue)
- 数据统计卡片展示
- 快速操作按钮
- 最近运单列表
- 异常提醒

### 2. 运单管理 (YunDan.vue)
- 运单列表展示
- 搜索和筛选功能
- 装货/卸货操作入口
- 状态标识

### 3. 运单详情 (YunDanDetail.vue)
- 运单基本信息
- 地址路线展示
- 操作按钮
- 状态跟踪

### 4. 装货详情 (LoadingDetail.vue)
- 装货信息填写
- 图片上传功能
- 时间选择
- 确认装货

### 5. 卸货详情 (UnloadingDetail.vue)
- 卸货信息填写
- 凭证图片上传
- 时间记录
- 确认卸货

### 6. 车辆管理 (VehicleManage.vue)
- 车辆列表展示
- 车辆状态管理
- 详细信息查看

### 7. 船舶管理 (ShipManage.vue)
- 船舶列表展示
- 船舶状态管理
- 调度信息

### 8. 异常上报 (ExceptionReport.vue)
- 异常类型选择
- 详细描述
- 图片上传
- 提交处理

### 9. 个人中心 (My.vue)
- 用户信息展示
- 功能设置
- 系统信息

## 🎨 设计规范

### 颜色方案
- 主色调: #1989fa (蓝色)
- 成功色: #07c160 (绿色)
- 警告色: #ff976a (橙色)
- 危险色: #ee0a24 (红色)
- 背景色: #f6f7fb (浅灰)

### 布局规范
- 页面容器统一使用 flex 布局
- 内容区域可滚动
- 底部按钮固定位置
- 响应式设计适配不同屏幕

## 📝 更新日志

### v1.0.0 (2024-12-19)
- ✨ 新增完整的物流管理功能模块
- 🎨 优化页面布局和用户体验
- 🐛 修复装货/卸货页面布局问题
- 📱 完善移动端适配
- 🗑️ 清理冗余代码和文件

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目 Issues: [GitHub Issues](https://github.com/your-username/carrier-unified-app/issues)
- 邮箱: your-email@example.com

---

**注意**: 这是一个演示项目，使用了模拟数据。在实际部署时，请替换为真实的API接口。
